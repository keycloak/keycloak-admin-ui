import { useContext } from "react";
import type { Context } from "react";

/**
 * Passes the call to `useContext` and throw an exception if the resolved value is either `null` or `undefined`.
 * Can be used for contexts that are required and should always have a non nullable value.
 *
 * @param context The context to pass to `useContext`
 * @returns
 */
export default function useRequiredContext<T>(
  context: Context<T>
): NonNullable<T> {
  const resolved = useContext(context);

  if (resolved !== undefined && resolved !== null) {
    return resolved as NonNullable<T>;
  }

  if (context.displayName) {
    throw new Error(
      `No provider found for the '${context.displayName}' context, make sure it is included in your component hierarchy.`
    );
  }

  throw new Error(
    `No provider found for an unknown context, make sure it is included in your component hierarchy.`
  );
}
