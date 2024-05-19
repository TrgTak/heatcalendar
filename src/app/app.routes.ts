
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./components/heat-calendar/calendar/calendar.component").then(c => c.CalendarComponent),
    },
];
