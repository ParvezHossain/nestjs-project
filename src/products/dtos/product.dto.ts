export class CreateProductDto {
    name: string;
    description: string;
    price: number;
}

export class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
}

export class ProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
}
