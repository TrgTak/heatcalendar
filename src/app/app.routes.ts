
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./components/heat-calendar/calendar/calendar.component").then(c => c.CalendarComponent),
        data: {
            //FIXME: Just sample parameters, field names etc. Don't forget to check this once backend is there.
            dateField: "creation_time",
            parameters: {
                contentType: "result",
            }
        }
    },
    {
        path: "daily",
        loadComponent: () => import("./components/daily-data/daily-data.component").then(c => c.DailyDataComponent),
    },
];
