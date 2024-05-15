
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        title: "Calendar",
        loadComponent: () => import("./components/calendar/calendar.component").then(c => c.CalendarComponent),
        data: {},
    },
];
