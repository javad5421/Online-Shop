function buildNestedMenu(categories, parent_id = null) {
    return categories
        .filter((category) => category.parent_id === parent_id)
        .map((category) => ({
            ...category,
            children: buildNestedMenu(categories, category.id),
        }));
}

export {buildNestedMenu};