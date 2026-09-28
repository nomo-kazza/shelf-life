export interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    pages?: number;
    isbn: string;
    finished: boolean;
    currentPage?: number;
    rating?: number;
    notes?: string;
}