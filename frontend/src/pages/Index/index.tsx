import React from "react";
import {
  Heading,
  Button,
  Box,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Text,
  TableBody,
} from "grommet";
import SearchForm from "../../containers/SearchForm";
import { Product, emptyProduct } from "../../util/schema/product";
import ProductItem from "../../containers/ProductItem";
import ReportRender, { ReportResult } from "../../containers/ReportRender";
import { Report, ConsumedProduct } from "../../util/schema/report";
import { postReport, getProductSearch } from "../../util/data/requests";
import styled from "styled-components";

const emptyReport = (): ReportResult => {
  return {
    timeDone: Date.now(),
    result: {
        total: emptyProduct(),
        consumed: []
    }
  }
}

const sendReport = (consumed: ConsumedProduct[], setReport: any) => {
  const report : Report = {
    consumed
  }; 
  
  postReport(report).then((json) => {
    setReport({completed: true, report: json});
  });
  
}

const emptyConsumed = (): Array<ConsumedProduct> => {
  return [];
};

const mapProductItems = (
  products: ConsumedProduct[],
  values: ConsumedProduct[],
  setFunction: any
) => {
  return products.map((product) => (
    <ProductItem
      key={product.id}
      id={product.id}
      name={product.name}
      amount={product.amount}
      changeFunc={(event) => {
        const result = values.map((pp) => {
          if (pp.id === product.id) {
            return {
              id: pp.id,
              name: pp.name,
              amount: +event.target.value,
            };
          }
          return pp;
        });
        setFunction(result);
      }}
      deleteFunc={() => {
        const result = values.filter((p) => p.id !== product.id);
        setFunction(result);
      }}
    />
  ));
};

const fileChosen = (file : any | undefined, setReport: any) => {
  const reader = new FileReader();
  reader.onloadend = (e: any) => {
    const content = reader.result;
    if(content) {
      const parsed :ReportResult = JSON.parse(content.toString());
      console.log(parsed);
      setReport({
        completed: true,
        report: { result: parsed }
      })
    }
  }

  reader.readAsText(file);
}

const StyledTable = styled(Table)`
  min-width: 40%;
`;

const Index = () => {
  const [consumed, setConsumed] = React.useState(emptyConsumed());
  const [report, setReport] = React.useState({
    completed: false,
    report: emptyReport()
  })

  const addElement = (product: Product) => {
    if(consumed.some(c => c.id === product.id)){
      return;
    }
    const result = consumed.concat([
      { id: product.id, name: product.name, amount: 100 },
    ]);
    setConsumed(result);
  };

  const submit = () => {
    sendReport(consumed, setReport);
  }

  const reset = () => {
    setConsumed(emptyConsumed());
  }

 

  return (
    <>
    {!report.completed ?
    <Box pad="large">
      <Heading>Create Report</Heading>
      <Box pad={{ bottom: "large" }}>
        <StyledTable>
          <TableHeader>
            <TableRow>
              <TableCell key={"name"} scope="col">
                <Text>Name</Text>
              </TableCell>
              <TableCell key={"amount"} scope="col">
                <Text>Amount (g)</Text>
              </TableCell>
              <TableCell key={"delete"} scope="col">
                <Text></Text>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mapProductItems(consumed, consumed, setConsumed)}
          </TableBody>
        </StyledTable>
      </Box>

      <Box pad={{ bottom: "large" }}>
        <SearchForm
          selectedFunction={(product: Product) => {
            addElement(product);
          }}
          suggestFunction={getProductSearch}
        />
      </Box>

      <Box>
        <Box direction="row" gap="medium">
          <Button type="submit" primary label="Submit" onClick={submit} />
          <Button type="reset" label="Reset" onClick={reset} />
        </Box>
      </Box>

      <Box>
        <Heading>Import from file</Heading>
        <input type="file" accept=".json" onChange={e => { 
          if(e.target.files){
                fileChosen(e.target.files[0], setReport);
          }
          }} />
      </Box>
    </Box>
    :
    <Box pad="large">
      <ReportRender result={report.report.result} />
    </Box>
    }
    </>
  );
};

export default Index;
