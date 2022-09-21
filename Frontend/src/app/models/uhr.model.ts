export interface Uhr{
    name:string,
    description:string,
    price:number,
    location:string,
    link:string
}

export interface Uhren{
    uhr_info:Uhr[]
}