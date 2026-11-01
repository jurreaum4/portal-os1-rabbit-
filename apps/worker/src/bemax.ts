import { readUniverse } from "./universe-api";
import { staffIdentity } from "./access";
import { readObject } from "./customer-auth";
import { providers as listProviders } from "./providers";
import { bemaxApi as bemaxHandler } from "./bemax/index";
import type { Env } from "./types";

export { bemaxApi } from "./bemax/index";

export async function compatibilityApi(
  request: Request,
  env: Env,
): Promise<Response | null> {
  return bemaxHandler(request, env);
}

const conversations = new Map<
  string,
  {
    id: string;
    title: string;
    ownerId: string;
    createdAt: string;
    messages: Array<{
      id: string;
      role: "user" | "assistant";
      content: string;
      createdAt: string;
    }>;
  }
>();

const json = (value: unknown, status = 200) =>
  Response.json(value, { status, headers: { "Cache-Control": "no-store" } });
