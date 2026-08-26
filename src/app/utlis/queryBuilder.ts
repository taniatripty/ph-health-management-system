
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

      
}