import { ReposList } from "./pages/reposlist/repos-list.component";
import { ReposDetails } from "./pages/reposdetails/repos-details.component";

export const routes = [
    {path: "", component: ReposList},
    {path: "repos_details", component: ReposDetails}
];

export const navigatableComponents = [
    ReposList,
    ReposDetails
];
