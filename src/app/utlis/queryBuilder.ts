
import { IQueryConfig, IQueryParams, prismaCountArgs, PrismaFindManyArgs, prismaModelDelegate, PrismaStringFilter, PrismaWhereConditions } from "../interface/query.interface";

export class queryBuilder<
T,
TwhereInput=Record<string , unknown>,
TincludeWhere=Record<string , unknown>



>{
    private query:PrismaFindManyArgs;
    private countQuery:prismaCountArgs;
    private page:number=1;
    private limit :number=10;
    private skip:number=0;
    private sortBy:string="createdAt";
    private sortOrder:'asc'| 'desc'='desc';
    private selectFields:Record<string , boolean | undefined>


    constructor(

          private model:prismaModelDelegate ,
        private queryParams:IQueryParams,
        private config:IQueryConfig
    


    ){
        this.query={
            where:{},
            include:{},
            orderBy:{},
            skip:0,
            take:10
        }
        this.countQuery={
            where:{}
        }
    }

      search() : this {
        const {searchTerm} = this.queryParams;
        const { searchableFields} = this.config;
        // doctorSearchableFields = ['user.name', 'user.email', 'specialties.specialty.title' , 'specialties.specialty.description']
        if(searchTerm && searchableFields && searchableFields.length > 0){
            const searchConditions : Record<string, unknown>[] = searchableFields.map((field) => {
                if(field.includes(".")){
                    const parts = field.split(".");

                    if(parts.length === 2){
                        const [relation, nestedField] = parts;

                        const stringFilter : PrismaStringFilter = {
                            contains : searchTerm,
                            mode : 'insensitive' as const,
                        }

                        return {
                            [relation] : {
                                [nestedField] : stringFilter
                            }
                        }
                    }else if(parts.length === 3){
                        const [relation, nestedRelation, nestedField] = parts;

                        const stringFilter : PrismaStringFilter = {
                            contains : searchTerm,
                            mode : 'insensitive' as const,
                        }

                        return {
                            [relation] : {
                                some :{
                                    [nestedRelation]: {
                                        [nestedField]: stringFilter
                                    }
                                }
                            }
                        }
                    }
                    
                }
                // direct field
                const stringFilter: PrismaStringFilter = {
                    contains: searchTerm,
                    mode: 'insensitive' as const,
                }

                return {
                    [field]: stringFilter
                }
            }
        )
         const whereConditions = this.query.where as PrismaWhereConditions

        whereConditions.OR = searchConditions;

        const countWhereConditions = this.countQuery.where as PrismaWhereConditions;
        countWhereConditions.OR = searchConditions;
        }

        return this;
    }



       filter() : this {

        const { filterableFields } = this.config;
        const excludedField = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder', 'fields', 'include'];

        const filterParams : Record<string, unknown> = {};

        Object.keys(this.queryParams).forEach((key) => {
            if(!excludedField.includes(key)){
                filterParams[key] = this.queryParams[key];
            }
        })

        const queryWhere = this.query.where as Record<string, unknown>;
        const countQueryWhere = this.countQuery.where as Record<string, unknown>;

        Object.keys(filterParams).forEach((key) => {
            const value = filterParams[key];

            if(value === undefined || value === ""){
                return;
            }

            const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);

            
            // doctorFilterableFields = ['specialties.specialty.title', 'appointmentFee']
            // /doctors?appointmentFee[lt]=100&appointmentFee[gt]=50 => { appointmentFee: { lt: '100', gt: '50' } }

            // /doctors?user.name=John => { user: { name: 'John' } }
            if(key.includes(".")){
                const parts = key.split(".");

                if(filterableFields && !filterableFields.includes(key)){
                    return;
                }



                if(parts.length === 2){
                    const [relation, nestedField] = parts;

                    if(!queryWhere[relation]){
                        queryWhere[relation] = {};
                        countQueryWhere[relation] = {};
                    }

                    const queryRelation = queryWhere[relation] as Record<string, unknown>;
                    const countRelation = countQueryWhere[relation] as Record<string, unknown>;

                    queryRelation[nestedField] = this.parseFileterValue(value);
                    countRelation[nestedField] = this.parseFilterValue(value);
                    return;
                }
                else if(parts.length === 3){
                    const [relation, nestedRelation, nestedField] = parts;

                    if(!queryWhere[relation]){
                        queryWhere[relation] = {
                            some: {}
                        };
                        countQueryWhere[relation] = {
                            some: {}
                        };
                    }
                    
                    const queryRelation = queryWhere[relation] as Record<string, unknown>;
                    const countRelation = countQueryWhere[relation] as Record<string, unknown>;

                    if(!queryRelation.some){
                        queryRelation.some = {};
                    }
                    if(!countRelation.some){
                        countRelation.some = {};
                    }

                    const querySome = queryRelation.some as Record<string, unknown>;
                    const countSome = countRelation.some as Record<string, unknown>;

                    if(!querySome[nestedRelation]){
                        querySome[nestedRelation] = {};
                    }

                    if(!countSome[nestedRelation]){
                        countSome[nestedRelation] = {};
                    }

                    const queryNestedRelation = querySome[nestedRelation] as Record<string, unknown>;
                    const countNestedRelation = countSome[nestedRelation] as Record<string, unknown>;

                    queryNestedRelation[nestedField] = this.parseFilterValue(value);
                    countNestedRelation[nestedField] = this.parseFilterValue(value);

                    return;
                }

            }
            if (!isAllowedField) {
                return;
            }


            // Range filter parsing
            if(typeof value === 'object' && value !== null && !Array.isArray(value)){
                queryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                countQueryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                return;
            }

            //direct value parsing
            queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);
        })
        return this;
    }

    
    private parseFilterValue(value : unknown) : unknown {

        if(value === 'true'){
            return true;
        }
        if(value === 'false'){
            return false;
        }

        if(typeof value === 'string' && !isNaN(Number(value)) && value != ""){
            return Number(value);
        }

        if(Array.isArray(value)){
            return { in : value.map((item) => this.parseFilterValue(item)) }
        }

        return value;
    }

     private parseRangeFilter(value : Record<string, string | number>) : PrismaNumberFilter | PrismaStringFilter | Record<string, unknown> {

        const rangeQuery: Record<string, string | number | (string | number)[] > = {};

        Object.keys(value).forEach((operator) => {
            const operatorValue = value[operator];


            const parsedValue : string | number = typeof operatorValue === 'string' && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;

            switch(operator){
                case 'lt':
                case 'lte':
                case 'gt':
                case 'gte':
                case 'equals':
                case 'not':
                case 'contains':
                case 'startsWith':
                case 'endsWith':
                    rangeQuery[operator] = parsedValue;
                    break;

                case 'in':
                case 'notIn':
                    if(Array.isArray(operatorValue)){
                        rangeQuery[operator] = operatorValue
                    }else {
                        rangeQuery[operator] = [parsedValue];
                    }
                    break;
                default:
                    break;

            }
        });

        return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
    }
}