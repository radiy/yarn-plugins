import { BaseCommand } from '@yarnpkg/cli';
import { Command, Option } from 'clipanion';
import { execUtils, Project, Workspace, structUtils } from '@yarnpkg/core';
import listChangedWorkspaces from '../utils/listChangedWorkspaces';

export abstract class FilterCommand extends BaseCommand {
  public gitRange = Option.String('--git-range');

  public cached = Option.Boolean('--cached', false);

  public include = Option.Array('--include');

  public exclude = Option.Array('--exclude');

  protected async listWorkspaces(
    project: Project,
  ): Promise<readonly Workspace[]> {
    const { stdout } = await execUtils.execvp(
      'git',
      [
        'diff',
        '--name-only',
        ...(this.cached ? ['--cached'] : []),
        ...(this.gitRange ? [this.gitRange] : []),
      ],
      {
        cwd: project.cwd,
        strict: true,
      },
    );
    const files = stdout.split(/\r?\n/);
    const workspaces = listChangedWorkspaces(project, files);
    const include = this.include || [];
    const exclude = this.exclude || [];

    return workspaces.filter((ws) => {
      const name = structUtils.stringifyIdent(ws.anchoredLocator);

      if (name) {
        if (include.length && !include.includes(name)) {
          return false;
        }

        if (exclude.length && exclude.includes(name)) {
          return false;
        }
      }

      return true;
    });
  }
}
