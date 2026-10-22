// Replaces ```figure blocks in Markdown with KEVOS® figures (src/utils/kevos-figures.ts).
// Runs before syntax highlighting, so figure specs never reach the code-block renderer.
// A malformed figure fails the build with the file name, rather than publishing a broken page.
import { parseFigure, renderFigure } from './kevos-figures.ts';

type MdNode = { type: string; lang?: string | null; value?: string; children?: MdNode[] };
type VFileLike = { path?: string; history?: string[] };

const hash = (s: string) => [...s].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) >>> 0, 7).toString(36);

export default function remarkKevosFigures() {
  return (tree: MdNode, file: VFileLike) => {
    const path = file.path ?? file.history?.[0] ?? 'page';
    const prefix = `kf${hash(path.replace(/\\/g, '/').split('/src/').pop() ?? path)}`;
    let n = 0;
    const visit = (node: MdNode) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'code' && child.lang === 'figure') {
          n += 1;
          try {
            return { type: 'html', value: renderFigure(parseFigure(child.value ?? ''), `${prefix}-${n}`, n) };
          } catch (error) {
            throw new Error(`${path}: figure ${n}: ${(error as Error).message}`);
          }
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}
