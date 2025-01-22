import { Project, Report } from '@yarnpkg/core';
import { PortablePath, xfs, ppath, Filename } from '@yarnpkg/fslib';

export default async function generateLockfile({
  destination,
  project,
  report,
}: {
  destination: PortablePath;
  project: Project;
  report: Report;
}): Promise<void> {
  const filename = ppath.join(project.cwd, Filename.lockfile);
  const dest = ppath.join(destination, Filename.lockfile);

  report.reportInfo(null, ppath.relative(project.cwd, filename));
  await xfs.mkdirpPromise(ppath.dirname(dest));
  await xfs.writeFilePromise(dest, project.generateLockfile());
}
