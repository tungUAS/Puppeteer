export interface Uhr{
    uhr_name:string,
    uhr_description:string,
    uhr_price:number,
    uhr_location:string,
    uhr_link:string
}

export interface Uhren{
    uhr_info:Uhr[]
}