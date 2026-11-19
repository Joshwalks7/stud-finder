export interface RebrickableSet {
    set_num: string;
    name: string;
    year: number;
    theme_id: number;
    num_parts: number;
    set_img_url: string | null;
    set_url: string;
}

export interface RebrickablePartDetails {
    part_num: string;
    name: string;
    part_cat_id: number;
    part_img_url: string | null;
}

export interface RebrickableColorDetails {
    id: number;
    name: string;
    rgb: string;
}

export interface RebrickableInventoryPart {
    inv_part_id: number;
    part: RebrickablePartDetails;
    color: RebrickableColorDetails;
    quantity: number;
    is_spare: boolean;
    element_id: string | null;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
