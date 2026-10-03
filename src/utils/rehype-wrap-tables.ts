// Wraps Markdown tables in <div class="table-wrap"> so wide tables scroll on small screens
// without losing table semantics.
type Node = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: Node[] };

export default function rehypeWrapTables() {
  return (tree: Node) => {
    const visit = (node: Node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'table') {
          return { type: 'element', tagName: 'div', properties: { className: ['table-wrap'] }, children: [child] };
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}
