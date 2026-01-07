#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer(
  {
    name: "elicitation-test-server",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

// Tool 1: Test text input elicitation
server.registerTool(
  "test_text_elicitation",
  {
    description: "Test text input elicitation mode",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Please enter your name:",
      requestedSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Name",
            description: "Your full name",
            minLength: 1,
          },
        },
        required: ["name"],
      },
    });

    if (result.action === "accept" && result.content) {
      return {
        content: [
          {
            type: "text",
            text: `Hello, ${result.content.name}! Text elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 2: Test number input elicitation
server.registerTool(
  "test_number_elicitation",
  {
    description: "Test number input elicitation mode",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Please enter a number between 1 and 100:",
      requestedSchema: {
        type: "object",
        properties: {
          number: {
            type: "integer",
            title: "Number",
            description: "A number between 1 and 100",
            minimum: 1,
            maximum: 100,
          },
        },
        required: ["number"],
      },
    });

    if (result.action === "accept" && result.content) {
      const num = result.content.number as number;
      return {
        content: [
          {
            type: "text",
            text: `You entered ${num}. Its square is ${num * num}. Number elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 3: Test boolean elicitation
server.registerTool(
  "test_boolean_elicitation",
  {
    description: "Test boolean (yes/no) elicitation mode",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Do you want to proceed with the operation?",
      requestedSchema: {
        type: "object",
        properties: {
          confirm: {
            type: "boolean",
            title: "Confirm",
            description: "Check to confirm proceeding",
            default: false,
          },
        },
        required: ["confirm"],
      },
    });

    if (result.action === "accept" && result.content) {
      const confirmed = result.content.confirm as boolean;
      const response = confirmed
        ? "You confirmed! Proceeding with the operation."
        : "You declined. Operation cancelled.";
      return {
        content: [{ type: "text", text: `${response} Boolean elicitation successful.` }],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 4: Test enum/select elicitation (single choice using enum)
server.registerTool(
  "test_select_elicitation",
  {
    description: "Test single selection (enum) elicitation mode",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Choose your favorite programming language:",
      requestedSchema: {
        type: "object",
        properties: {
          language: {
            type: "string",
            title: "Programming Language",
            description: "Your favorite programming language",
            enum: ["TypeScript", "Python", "Rust", "Go", "Java"],
          },
        },
        required: ["language"],
      },
    });

    if (result.action === "accept" && result.content) {
      return {
        content: [
          {
            type: "text",
            text: `Great choice! ${result.content.language} is an excellent language. Select elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 5: Test multiselect elicitation (array with enum)
server.registerTool(
  "test_multiselect_elicitation",
  {
    description: "Test multiselect (array with enum) elicitation mode",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Select your favorite fruits:",
      requestedSchema: {
        type: "object",
        properties: {
          fruits: {
            type: "array",
            title: "Fruits",
            description: "Select your favorite fruits",
            items: {
              type: "string",
              enum: ["Apple", "Banana", "Orange", "Grape", "Mango", "Strawberry"],
            },
            minItems: 1,
          },
        },
        required: ["fruits"],
      },
    });

    if (result.action === "accept" && result.content) {
      const fruits = result.content.fruits as string[];
      return {
        content: [
          {
            type: "text",
            text: `You selected: ${fruits.join(", ")}. Multiselect elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 6: Test email format validation
server.registerTool(
  "test_email_elicitation",
  {
    description: "Test email format validation elicitation",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Please provide your email address:",
      requestedSchema: {
        type: "object",
        properties: {
          email: {
            type: "string",
            title: "Email",
            description: "Your email address",
            format: "email",
          },
        },
        required: ["email"],
      },
    });

    if (result.action === "accept" && result.content) {
      return {
        content: [
          {
            type: "text",
            text: `Email ${result.content.email} saved. Email format elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 7: Test date format elicitation
server.registerTool(
  "test_date_elicitation",
  {
    description: "Test date format elicitation",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Please select a date:",
      requestedSchema: {
        type: "object",
        properties: {
          date: {
            type: "string",
            title: "Date",
            description: "Select a date",
            format: "date",
          },
        },
        required: ["date"],
      },
    });

    if (result.action === "accept" && result.content) {
      return {
        content: [
          {
            type: "text",
            text: `Date selected: ${result.content.date}. Date format elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 8: Test multi-field form elicitation
server.registerTool(
  "test_multi_field_elicitation",
  {
    description: "Test elicitation with multiple input fields of different types",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Please fill out your profile:",
      requestedSchema: {
        type: "object",
        properties: {
          username: {
            type: "string",
            title: "Username",
            description: "Your username (3-20 characters)",
            minLength: 3,
            maxLength: 20,
          },
          age: {
            type: "integer",
            title: "Age",
            description: "Your age",
            minimum: 0,
            maximum: 150,
          },
          newsletter: {
            type: "boolean",
            title: "Newsletter",
            description: "Subscribe to newsletter?",
            default: false,
          },
          theme: {
            type: "string",
            title: "Theme",
            description: "Preferred theme",
            enum: ["light", "dark", "system"],
          },
        },
        required: ["username", "age", "theme"],
      },
    });

    if (result.action === "accept" && result.content) {
      const { username, age, newsletter, theme } = result.content as {
        username: string;
        age: number;
        newsletter?: boolean;
        theme: string;
      };
      return {
        content: [
          {
            type: "text",
            text: `Profile created!\nUsername: ${username}\nAge: ${age}\nNewsletter: ${newsletter ? "Yes" : "No"}\nTheme: ${theme}\nMulti-field elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 9: Test optional fields elicitation
server.registerTool(
  "test_optional_field_elicitation",
  {
    description: "Test elicitation with optional fields",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Provide your contact information:",
      requestedSchema: {
        type: "object",
        properties: {
          email: {
            type: "string",
            title: "Email",
            description: "Your email address (required)",
            format: "email",
          },
          phone: {
            type: "string",
            title: "Phone",
            description: "Your phone number (optional)",
          },
          website: {
            type: "string",
            title: "Website",
            description: "Your website URL (optional)",
            format: "uri",
          },
        },
        required: ["email"],
      },
    });

    if (result.action === "accept" && result.content) {
      const { email, phone, website } = result.content as {
        email: string;
        phone?: string;
        website?: string;
      };
      let response = `Contact info saved!\nEmail: ${email}`;
      if (phone) response += `\nPhone: ${phone}`;
      if (website) response += `\nWebsite: ${website}`;
      response += "\nOptional field elicitation successful.";
      return { content: [{ type: "text", text: response }] };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 10: Test multi-step workflow elicitation
server.registerTool(
  "test_multi_step_elicitation",
  {
    description: "Test multi-step workflow with multiple form elicitation requests",
    inputSchema: {},
  },
  async () => {
    const results: string[] = [];

    // Step 1: Basic Info
    const step1 = await server.server.elicitInput({
      mode: "form",
      message: "Step 1/3: Enter your basic information",
      requestedSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Full Name",
            description: "Your full name",
            minLength: 1,
          },
          email: {
            type: "string",
            title: "Email",
            description: "Your email address",
            format: "email",
          },
        },
        required: ["name", "email"],
      },
    });

    if (step1.action !== "accept" || !step1.content) {
      return { content: [{ type: "text", text: `Stopped at step 1. Action: ${step1.action}` }] };
    }
    results.push(`Name: ${step1.content.name}`, `Email: ${step1.content.email}`);

    // Step 2: Preferences
    const step2 = await server.server.elicitInput({
      mode: "form",
      message: "Step 2/3: Set your preferences",
      requestedSchema: {
        type: "object",
        properties: {
          language: {
            type: "string",
            title: "Language",
            description: "Preferred language",
            enum: ["English", "Chinese", "Japanese", "Spanish", "French"],
          },
          notifications: {
            type: "boolean",
            title: "Notifications",
            description: "Enable notifications?",
            default: true,
          },
        },
        required: ["language"],
      },
    });

    if (step2.action !== "accept" || !step2.content) {
      return { content: [{ type: "text", text: `Stopped at step 2. Action: ${step2.action}` }] };
    }
    results.push(
      `Language: ${step2.content.language}`,
      `Notifications: ${step2.content.notifications ? "Enabled" : "Disabled"}`
    );

    // Step 3: Confirmation
    const step3 = await server.server.elicitInput({
      mode: "form",
      message: "Step 3/3: Review and confirm\n\n" + results.join("\n"),
      requestedSchema: {
        type: "object",
        properties: {
          confirm: {
            type: "boolean",
            title: "Confirm",
            description: "I confirm the above information is correct",
            default: false,
          },
        },
        required: ["confirm"],
      },
    });

    if (step3.action !== "accept" || !step3.content) {
      return { content: [{ type: "text", text: `Stopped at step 3. Action: ${step3.action}` }] };
    }

    const confirmed = step3.content.confirm as boolean;
    if (confirmed) {
      return {
        content: [
          {
            type: "text",
            text: `Multi-step workflow completed successfully!\n\n${results.join("\n")}\n\nConfirmed: Yes`,
          },
        ],
      };
    } else {
      return {
        content: [{ type: "text", text: "User did not confirm. Registration cancelled." }],
      };
    }
  }
);

// Tool 11: Test titled enum elicitation (oneOf style with display labels)
server.registerTool(
  "test_titled_enum_elicitation",
  {
    description: "Test titled enum elicitation with display labels (oneOf)",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Select your subscription plan:",
      requestedSchema: {
        type: "object",
        properties: {
          plan: {
            type: "string",
            title: "Subscription Plan",
            description: "Choose your plan",
            oneOf: [
              { const: "free", title: "Free - $0/month" },
              { const: "basic", title: "Basic - $9.99/month" },
              { const: "pro", title: "Pro - $19.99/month" },
              { const: "enterprise", title: "Enterprise - Contact us" },
            ],
          },
        },
        required: ["plan"],
      },
    });

    if (result.action === "accept" && result.content) {
      return {
        content: [
          {
            type: "text",
            text: `You selected the "${result.content.plan}" plan. Titled enum elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 12: Test titled multiselect elicitation (anyOf style with display labels)
server.registerTool(
  "test_titled_multiselect_elicitation",
  {
    description: "Test titled multiselect elicitation with display labels (anyOf)",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Select the features you want to enable:",
      requestedSchema: {
        type: "object",
        properties: {
          features: {
            type: "array",
            title: "Features",
            description: "Select features to enable",
            items: {
              anyOf: [
                { const: "dark_mode", title: "Dark Mode - Easy on the eyes" },
                { const: "notifications", title: "Notifications - Stay updated" },
                { const: "auto_save", title: "Auto-save - Never lose work" },
                { const: "cloud_sync", title: "Cloud Sync - Access anywhere" },
                { const: "two_factor", title: "2FA - Extra security" },
              ],
            },
            minItems: 1,
          },
        },
        required: ["features"],
      },
    });

    if (result.action === "accept" && result.content) {
      const features = result.content.features as string[];
      return {
        content: [
          {
            type: "text",
            text: `Enabled features: ${features.join(", ")}. Titled multiselect elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

// Tool 13: Test all basic types in one form
server.registerTool(
  "test_all_types_elicitation",
  {
    description: "Test all basic JSON Schema types in a single form",
    inputSchema: {},
  },
  async () => {
    const result = await server.server.elicitInput({
      mode: "form",
      message: "Test all input types:",
      requestedSchema: {
        type: "object",
        properties: {
          stringField: {
            type: "string",
            title: "String",
            description: "A text string",
          },
          integerField: {
            type: "integer",
            title: "Integer",
            description: "An integer number",
          },
          numberField: {
            type: "number",
            title: "Number",
            description: "A decimal number",
          },
          booleanField: {
            type: "boolean",
            title: "Boolean",
            description: "A true/false value",
          },
          enumField: {
            type: "string",
            title: "Enum",
            description: "Select one option",
            enum: ["Option A", "Option B", "Option C"],
          },
        },
        required: ["stringField", "integerField", "numberField", "booleanField", "enumField"],
      },
    });

    if (result.action === "accept" && result.content) {
      const { stringField, integerField, numberField, booleanField, enumField } = result.content as {
        stringField: string;
        integerField: number;
        numberField: number;
        booleanField: boolean;
        enumField: string;
      };
      return {
        content: [
          {
            type: "text",
            text: `All types received:\n- String: "${stringField}"\n- Integer: ${integerField}\n- Number: ${numberField}\n- Boolean: ${booleanField}\n- Enum: ${enumField}\n\nAll types elicitation successful.`,
          },
        ],
      };
    } else if (result.action === "decline") {
      return {
        content: [{ type: "text", text: "User declined to provide input." }],
      };
    } else {
      return {
        content: [{ type: "text", text: "User cancelled the elicitation." }],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Elicitation Test MCP Server running on stdio");
  console.error("Available tools:");
  console.error("  1. test_text_elicitation - Text input");
  console.error("  2. test_number_elicitation - Number input with min/max");
  console.error("  3. test_boolean_elicitation - Boolean (checkbox)");
  console.error("  4. test_select_elicitation - Single select (enum)");
  console.error("  5. test_multiselect_elicitation - Multiselect (array with enum)");
  console.error("  6. test_email_elicitation - Email format validation");
  console.error("  7. test_date_elicitation - Date format");
  console.error("  8. test_multi_field_elicitation - Multiple fields");
  console.error("  9. test_optional_field_elicitation - Optional fields");
  console.error("  10. test_multi_step_elicitation - Multi-step workflow");
  console.error("  11. test_titled_enum_elicitation - Titled enum (oneOf)");
  console.error("  12. test_titled_multiselect_elicitation - Titled multiselect (anyOf)");
  console.error("  13. test_all_types_elicitation - All types in one form");
}

main().catch(console.error);
