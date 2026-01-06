import { NextRequest, NextResponse } from 'next/server';
import { DiagramContext, AIAction } from '@/types/aiActions';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Build dynamic system prompt based on diagram context
function buildSystemPrompt(context?: DiagramContext): string {
  const basePrompt = `You are DMPro AI Copilot, an intelligent assistant for a professional data modeling tool. You can both answer questions AND make changes to the user's data model.

## Your Capabilities:
1. **Create & Modify**: Add tables, columns, relationships, indexes
2. **Analyze**: Review schema design, suggest improvements
3. **Advise**: Best practices for normalization, naming, performance
4. **Document**: Help describe tables, columns, relationships

## Response Format:
When the user asks you to make changes (add, update, delete anything), you MUST:
1. Briefly explain what you'll do
2. Include an ACTION block with the exact changes

ACTION BLOCK FORMAT (use exactly this format):
\`\`\`action
{"type": "actionType", "payload": {...}, "description": "Human readable description"}
\`\`\`

## Available Actions:
- addTable: Create a new table with columns
- updateTable: Modify table properties (name, schema, description)
- deleteTable: Remove a table
- addColumn: Add a column to a table
- updateColumn: Modify column properties
- deleteColumn: Remove a column
- addRelationship: Create a relationship between tables
- deleteRelationship: Remove a relationship
- addIndex: Add an index to a table
- deleteIndex: Remove an index

## Action Examples:

### Add a new table:
\`\`\`action
{"type": "addTable", "payload": {"name": "Users", "columns": [{"name": "id", "dataType": "INT", "isPK": true, "isNullable": false}, {"name": "email", "dataType": "VARCHAR(255)", "isPK": false, "isNullable": false}], "schema": "dbo"}, "description": "Create Users table with id and email"}
\`\`\`

### Add a column:
\`\`\`action
{"type": "addColumn", "payload": {"tableName": "Users", "column": {"name": "created_at", "dataType": "DATETIME", "isPK": false, "isNullable": false}}, "description": "Add created_at column to Users"}
\`\`\`

### Add a relationship:
\`\`\`action
{"type": "addRelationship", "payload": {"fromTable": "Orders", "toTable": "Users", "type": "1:N", "relationshipType": "non-identifying"}, "description": "Link Orders to Users (many orders per user)"}
\`\`\`

### Delete a table:
\`\`\`action
{"type": "deleteTable", "payload": {"tableName": "TempTable"}, "description": "Delete TempTable"}
\`\`\`

### Update a table (rename, change schema, or add description):
\`\`\`action
{"type": "updateTable", "payload": {"tableName": "Users", "updates": {"description": "Stores user account information including credentials and profile data"}}, "description": "Add description to Users table"}
\`\`\`

## Important Rules:
- ALWAYS use the exact action block format shown above
- Use proper SQL data types (INT, VARCHAR(n), DATETIME, DECIMAL(p,s), TEXT, etc.)
- Primary keys should have isPK: true and isNullable: false
- Foreign keys should reference existing tables
- Be concise but helpful in explanations
- If you're unsure what the user wants, ask for clarification
- You can include multiple action blocks if the user requests multiple changes`;

  if (!context || context.tables.length === 0) {
    return basePrompt + `

## Current Diagram State:
The diagram is currently empty. No tables or relationships exist yet.`;
  }

  // Build schema description
  const tableDescriptions = context.tables.map(table => {
    const columns = table.columns.map(col => {
      let desc = `    - ${col.name}: ${col.dataType}`;
      if (col.isPK) desc += ' (PK)';
      if (col.isFK) desc += ' (FK)';
      if (!col.isNullable) desc += ' NOT NULL';
      return desc;
    }).join('\n');
    return `  ${table.schema ? table.schema + '.' : ''}${table.name}:\n${columns}`;
  }).join('\n\n');

  const relationshipDescriptions = context.relationships.length > 0
    ? context.relationships.map(rel =>
        `  - ${rel.fromTable} → ${rel.toTable} (${rel.type}, ${rel.relationshipType})`
      ).join('\n')
    : '  No relationships defined yet.';

  const selectedInfo = context.selectedTableName
    ? `\nCurrently Selected Table: ${context.selectedTableName}`
    : '';

  return basePrompt + `

## Current Diagram State:
Model Type: ${context.modelType}
Total Tables: ${context.totalTables}
Total Relationships: ${context.totalRelationships}${selectedInfo}

### Tables:
${tableDescriptions}

### Relationships:
${relationshipDescriptions}

Use this context to provide accurate suggestions and avoid creating duplicate tables or invalid relationships.`;
}

// Parse action blocks from AI response
function parseActions(content: string): AIAction[] {
  const actions: AIAction[] = [];
  const actionBlockRegex = /```action\s*([\s\S]*?)```/g;

  let match;
  while ((match = actionBlockRegex.exec(content)) !== null) {
    try {
      const actionJson = match[1].trim();
      const action = JSON.parse(actionJson);
      if (action.type && action.payload && action.description) {
        actions.push(action as AIAction);
      }
    } catch (e) {
      console.error('Failed to parse action block:', e);
    }
  }

  return actions;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Build dynamic system prompt with context
    const systemPrompt = buildSystemPrompt(context as DiagramContext | undefined);

    // Prepare messages with system prompt
    const fullMessages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 4096,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Parse any action blocks from the response
    const actions = parseActions(assistantMessage);

    return NextResponse.json({
      message: assistantMessage,
      actions: actions.length > 0 ? actions : undefined,
      usage: data.usage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
