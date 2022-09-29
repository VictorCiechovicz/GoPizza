


export type ProductNavigationProps= {
id?: string;
}


export type OrderNavigationProps= {
  id: string;
  }
  


//aqui estamos typando todas as rotas da nossa aplicacao
export declare global{
  namespace ReactNavigation{
interface RootParamList{

  Home:undefined;
  Product: ProductNavigationProps;
  Order:OrderNavigationProps;
  Orders:undefined;
}

  }
}