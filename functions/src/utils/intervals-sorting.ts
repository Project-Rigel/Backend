//TODO compare using momentjs dates
export function appointmentComparer(a: any, b: any) {
    if (a.from < b.from) {
        return -1;
    }
    if (a.from > b.from) {
        return 1;
    }
    return 0;
}
