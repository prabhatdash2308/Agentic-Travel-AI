/**
 * API Service — connects the frontend to the FastAPI backend.
 *
 * Endpoints used:
 *   POST /api/workflow/run       → start a workflow, receive workflow_id
 *   GET  /api/workflow/{id}      → poll for status + results
 *
 * In development, Vite proxies /api → http://localhost:8000 automatically.
 * In production, set VITE_API_URL to your deployed backend URL.
 */

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

console.log("API BASE =", API_BASE);

// ─── Types ────────────────────────────────────────────────────────────────────

export type WorkflowStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface WorkflowResponse {
  workflow_id: string;
  status: WorkflowStatus;
  message: string;
  created_at: string;
  estimated_steps: string[];
  final_plan: string | null;
  completed_steps: string[];
}

export interface WorkflowRequest {
  query: string;
  user_id?: string;
  preferences?: {
    budget?: "budget" | "mid-range" | "luxury";
    travel_style?: string[];
    duration_days?: number;
    origin?: string;
    destinations?: string[];
  };
}

export interface ApiError {
  error_code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorBody: ApiError;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = { error_code: "HTTP_ERROR", message: `HTTP ${res.status}: ${res.statusText}` };
    }
    throw new Error(errorBody.message ?? `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Submit a travel planning workflow.
 * Returns immediately with a workflow_id (HTTP 202).
 */
export async function startWorkflow(request: WorkflowRequest): Promise<WorkflowResponse> {
  console.log("API_BASE =", API_BASE);
  console.log("Calling:", `${API_BASE}/api/workflow/run`);

  const res = await fetch(`${API_BASE}/api/workflow/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal: AbortSignal.timeout(15_000), // 15 s timeout for initial submit
  });
  return handleResponse<WorkflowResponse>(res);
}

/**
 * Poll the status of a workflow by ID.
 * Call every ~2 seconds until status is "completed" | "failed".
 */
export async function getWorkflow(workflowId: string): Promise<WorkflowResponse> {
  const res = await fetch(`${API_BASE}/api/workflow/${workflowId}`, {
    signal: AbortSignal.timeout(10_000),
  });
  return handleResponse<WorkflowResponse>(res);
}

/**
 * Poll until the workflow reaches a terminal state.
 * Calls onUpdate(response) on every successful poll.
 * Rejects if maxAttempts is exceeded or the workflow fails.
 */
export async function pollWorkflow(
  workflowId: string,
  onUpdate: (response: WorkflowResponse) => void,
  intervalMs = 2000,
  maxAttempts = 150 // ~5 minutes
): Promise<WorkflowResponse> {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const tick = async () => {
      attempts++;
      if (attempts > maxAttempts) {
        reject(new Error("Workflow timed out after 5 minutes."));
        return;
      }

      try {
        const response = await getWorkflow(workflowId);
        onUpdate(response);

        if (response.status === "completed") {
          resolve(response);
          return;
        }

        if (response.status === "failed" || response.status === "cancelled") {
          reject(new Error(response.message ?? "Workflow failed."));
          return;
        }

        // Still running — schedule next poll
        setTimeout(tick, intervalMs);
      } catch (err) {
        // Network errors: retry a few times before giving up
        if (attempts < 3) {
          setTimeout(tick, intervalMs * 2);
        } else {
          reject(err);
        }
      }
    };

    tick();
  });
}
