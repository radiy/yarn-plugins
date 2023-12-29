import { Workspace } from '@yarnpkg/core';
import { PortablePath, ppath, xfs } from '@yarnpkg/fslib';

export default async function getDockerFilePath(
  workspace: Workspace,
  filename = 'Dockerfile',
): Promise<PortablePath> {
  const path = filename as PortablePath;

  if (ppath.isAbsolute(path)) {
    return path;
  }

  const candidates = [
    ppath.join(workspace.cwd, path),
    ppath.join(workspace.project.cwd, path),
  ];

  for (const candidate of candidates) {
    if (await xfs.existsPromise(candidate)) {
      return candidate;
    }
  }

  throw new Error('Dockerfile is required');
}
