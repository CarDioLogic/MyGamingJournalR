import { Genre } from "./genre"
import { Platform } from "./platform"
export interface FilterParams{
    genres: Array<Genre>,
    platforms: Array<Platform>,
}