export function shouldApplyOfflinePatch(
  serverUpdatedAt: string | undefined,
  operationUpdatedAt: string,
): boolean {
  if (!serverUpdatedAt) {
    return true;
  }

  const serverTime = Date.parse(serverUpdatedAt);
  const operationTime = Date.parse(operationUpdatedAt);
  if (!Number.isFinite(serverTime) || !Number.isFinite(operationTime)) {
    return true;
  }

  return serverTime <= operationTime;
}
