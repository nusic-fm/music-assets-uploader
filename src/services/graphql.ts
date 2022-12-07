// import { graphql, buildSchema } from "graphql";

import axios from "axios";
import { ethers } from "ethers";

// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// var rootValue = { hello: () => "Hello world!" };

// var source = "{ hello }";

// graphql({ schema, source, rootValue }).then((response) => {
//   console.log(response);
// });

export const getBids = async () => {
  const graphqlQuery = {
    query: `{auctionBidPlaceds(orderBy: blockTimestamp, orderDirection: desc) {
                    _bidAmount
                    _bidder
                    }}`,
    variables: {},
  };
  try {
    const { data } = await axios.post(
      "https://api.studio.thegraph.com/query/38972/nusic-gbm-auction/v0.0.1",
      graphqlQuery
    );
    return data.auctionBidPlaceds;
  } catch (e: any) {}
};

export const getIncentivesAmount = async (address: string): Promise<string> => {
  const graphqlQuery = {
    query: `{
                auctionIncentivePaids(where: {_earner: "${address}"}) {
                    _incentiveAmount
                }
            }`,
    variables: {},
  };
  try {
    const response = await axios.post(
      "https://api.studio.thegraph.com/query/38972/nusic-gbm-auction/v0.0.1",
      graphqlQuery
    );
    const incentives = response.data.data.auctionIncentivePaids;
    if (incentives?.length) {
      if (incentives.length > 1) {
        const totalBn = incentives.reduce(
          (x: any, y: any) =>
            Number(ethers.utils.formatEther(x._incentiveAmount)) +
            Number(ethers.utils.formatEther(y._incentiveAmount))
        );
        return totalBn.toString();
      } else {
        return ethers.utils.formatEther(incentives[0]._incentiveAmount);
      }
    }
    return "0.00";
  } catch (e: any) {
    console.log("Unable to fetch incentives: ", e.message);
    return "0.00";
  }
};
