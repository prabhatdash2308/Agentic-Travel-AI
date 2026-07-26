import { useState, useCallback, useRef } from "react";
import {
  startWorkflow,
  pollWorkflow,
  type WorkflowRequest,
  type WorkflowResponse,
  type WorkflowStatus,
} from "../services/apiService";

export interface WorkflowState {
  status: "idle" | WorkflowStatus;
  workflowId: string | null;
  response: WorkflowResponse | null;
  estimatedSteps: string[];
  completedSteps: string[];
  finalPlan: string | null;
  error: string | null;
  isLoading: boolean;
}

const INITIAL_STATE: WorkflowState = {
  status: "idle",
  workflowId: null,
  response: null,
  estimatedSteps: [],
  completedSteps: [],
  finalPlan: null,
  error: null,
  isLoading: false,
};

export function useWorkflow() {
  const [state, setState] = useState<WorkflowState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(async (request: WorkflowRequest) => {
    // Client-side validation
    if (!request.query || request.query.trim().length < 10) {
      setState((prev) => ({
        ...prev,
        status: "failed",
        error: "Please provide a more detailed travel request (at least 10 characters).",
        isLoading: false,
      }));
      return;
    }

    // Cancel any in-progress workflow
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState({
      ...INITIAL_STATE,
      status: "pending",
      isLoading: true,
    });

    try {
      // Step 1: Submit the workflow
      const initialResponse = await startWorkflow(request);

      setState((prev) => ({
        ...prev,
        status: "pending",
        workflowId: initialResponse.workflow_id,
        estimatedSteps: initialResponse.estimated_steps,
        response: initialResponse,
      }));

      // Step 2: Poll until done
      await pollWorkflow(
        initialResponse.workflow_id,
        (response: WorkflowResponse) => {
          setState((prev) => ({
            ...prev,
            status: response.status,
            response,
            estimatedSteps: response.estimated_steps.length
              ? response.estimated_steps
              : prev.estimatedSteps,
            completedSteps: response.completed_steps,
            finalPlan: response.final_plan,
          }));
        }
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setState((prev) => ({
        ...prev,
        status: "failed",
        error: message,
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(INITIAL_STATE);
  }, []);

  return { state, run, reset };
}
