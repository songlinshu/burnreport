export interface ConsumedProduct {
    id: number;
    name: string;
    amount: number;
}
  
export interface Report {
    consumed: ConsumedProduct[]
}

export interface ReportNutrientTotal {
    carbohydrates: number;
    fat: number;
    kcal: number;
    protein: number;
}

export interface FlatProduct {
    name: string;
    manufacturer: string;
    kcal: number;
    kj: number;
    carbohydrates: number;
    sugar: number;
    addedSugaer: number;
    fiber: number;
    starch: number;
    fat: number;
    saturated: number;
    monounsaturated: number;
    trans: number;
    protein: number;
    salt: number;
}