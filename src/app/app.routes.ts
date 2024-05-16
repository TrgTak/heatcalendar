
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        title: "Calendar",
        loadComponent: () => import("./components/heat-calendar/heat-calendar.component").then(c => c.HeatCalendarComponent),
        data: {},
    },
];
