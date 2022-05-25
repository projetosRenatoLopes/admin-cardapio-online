export function compare(a, b) {
    if (a.categ > b.categ)
        return -1;
    if (a.categ < b.categ)
        return 1;
    return 0;
}