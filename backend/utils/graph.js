function isValid(edge) {
    if (!edge || typeof edge !== "string") return false;
    edge = edge.trim();

    const regex = /^[A-Z]->[A-Z]$/;
    if (!regex.test(edge)) return false;

    const [p, c] = edge.split("->");
    if (p === c) return false;

    return true;
}

function processData(data) {
    let invalid = [];
    let duplicates = [];
    let seen = new Set();
    let validEdges = [];

    // VALIDATION + DUPLICATES
    for (let edge of data) {
        if (!isValid(edge)) {
            invalid.push(edge);
            continue;
        }

        edge = edge.trim();

        if (seen.has(edge)) {
            if (!duplicates.includes(edge)) duplicates.push(edge);
        } else {
            seen.add(edge);
            validEdges.push(edge);
        }
    }

    // GRAPH
    const graph = {};
    const childSet = new Set();
    const allNodes = new Set();

    for (let edge of validEdges) {
        let [p, c] = edge.split("->");

        if (!graph[p]) graph[p] = [];

        // multi-parent case
        if (childSet.has(c)) continue;

        graph[p].push(c);
        childSet.add(c);

        allNodes.add(p);
        allNodes.add(c);
    }

    // ROOTS
    let roots = [...allNodes].filter(n => !childSet.has(n));
    if (roots.length === 0) {
        roots = [[...allNodes].sort()[0]];
    }

    let hierarchies = [];
    let totalTrees = 0;
    let totalCycles = 0;
    let maxDepth = 0;
    let largestRoot = "";

    function dfs(node, stack) {
        if (stack.has(node)) return { cycle: true };

        stack.add(node);

        let tree = {};

        for (let child of (graph[node] || [])) {
            if (stack.has(child)) return { cycle: true };

            let res = dfs(child, stack);
            if (res.cycle) return { cycle: true };

            tree[child] = res.tree;
        }

        stack.delete(node);
        return { tree };
    }

    function depth(node) {
        if (!graph[node]) return 1;

        let d = 0;
        for (let child of graph[node]) {
            d = Math.max(d, depth(child));
        }
        return d + 1;
    }

    for (let root of roots) {
        let res = dfs(root, new Set());

        if (res.cycle) {
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
            totalCycles++;
        } else {
            let d = depth(root);

            hierarchies.push({
                root,
                tree: { [root]: res.tree },
                depth: d
            });

            totalTrees++;

            if (d > maxDepth || (d === maxDepth && root < largestRoot)) {
                maxDepth = d;
                largestRoot = root;
            }
        }
    }

    return {
        hierarchies,
        invalid_entries: invalid,
        duplicate_edges: duplicates,
        summary: {
            total_trees: totalTrees,
            total_cycles: totalCycles,
            largest_tree_root: largestRoot
        }
    };
}

module.exports = { processData };