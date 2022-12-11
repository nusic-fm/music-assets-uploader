import axios from "axios";

const first = "https://api.thegraph.com/subgraphs/name/logesh2496/little-haiti";
const second =
  "https://api.thegraph.com/subgraphs/name/logesh2496/little-haiti-platinum";
export const getMints = async () => {
  const query = `
            {
                minteds(first: 5) {
                    to
                    tokenQuantity
                    amountTransfered
                    _type
                    transactionHash
                }
            }
    `;
  try {
    const multiResponse = await axios.all([
      axios.post(first, { query }),
      axios.post(second, { query }),
    ]);
    const mints = [
      ...multiResponse[0].data.data.minteds,
      ...multiResponse[1].data.data.minteds,
    ];
    return mints;
  } catch (e: any) {
    console.log(e.message);
  }
};
