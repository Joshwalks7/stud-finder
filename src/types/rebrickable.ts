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
    part_url: string;
    part_img_url: string | null;
    external_ids: Record<string, string[]>;
}

export interface RebrickableColorDetails {
    id: number;
    name: string;
    rgb: string;
    is_trans: boolean;
    external_ids: Record<string, unknown>;
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
    page_size: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
