
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./views/year-view/year-view.component").then(c => c.YearViewComponent),
        data: {
            //FIXME: Just sample parameters, field names etc. Don't forget to check this once backend is there.
            dateField: "creation_time",
            parameters: {
                contentType: "result",
            }
        }
    },
    {
        path: "day",
        loadComponent: () => import("./views/day-view/day-view.component").then(c => c.DayViewComponent),
    },
];
