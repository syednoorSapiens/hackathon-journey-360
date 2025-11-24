import axios from "axios";
import { FormSchema } from "../types/schema";

export async function callSmartSchemaAPI(
  userStory: string,
  schema?: FormSchema
): Promise<FormSchema> {
  try {
    const response = await axios.post("/api/smart-schema", {
      userContext: userStory,
      schema: schema,
    });
    return response.data.schema;
  } catch (error) {
    console.error("Error calling Smart Schema API:", error);
    throw error;
  }
}
