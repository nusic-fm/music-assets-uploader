import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { MoralisNftData, NftDetails, SelectedNftDetails } from "../../models";
import { createUrlFromCid } from "../../utils";

type Props = {
  onConnect: () => void;
  onInsert: (nft: SelectedNftDetails | MoralisNftData) => void;
};

const NftsByWallet = ({ onConnect, onInsert }: Props) => {
  const { account } = useWeb3React();
  const [tokens, setTokens] = useState<MoralisNftData[]>([]);
  // const [previewNft, setPreviewNft] = useState<SelectedNftDetails>(); //TODO
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const onFetchNftPreview = async (
    tokenUri: string
  ): Promise<NftDetails | null> => {
    const response = await axios.post(`${process.env.REACT_APP_SERVER}/nft/`, {
      tokenUri,
    });
    if (response) {
      const data = response.data as NftDetails;
      return data;
    } else {
      return null;
    }
  };

  const onNftSelect = async (nftData: MoralisNftData) => {
    if (nftData.token_uri) {
      setIsPreviewLoading(true);
      try {
        const metadata = await onFetchNftPreview(nftData.token_uri);
        if (metadata) {
          const newTokens = tokens.map((t) => {
            if (
              t.token_address === nftData.token_address &&
              t.token_id === nftData.token_id
            ) {
              return { ...t, artworkUrl: metadata.artworkUrl };
            }
            return t;
          });
          setTokens(newTokens);
          // setPreviewNft({
          //   address: nftData.token_address,
          //   artworkUrl: metadata.artworkUrl,
          //   audioFileUrl: metadata.audioFileUrl,
          //   name: metadata.name,
          //   tokenId: nftData.token_id,
          //   format: metadata.format,
          //   tokenUri: nftData.token_uri,
          // });
        } else {
          alert("Unable to retrieve the NFT metadata, please try again later");
        }
      } catch (e: any) {
        alert("Unable to retrieve the NFT metadata, please try again later");
      } finally {
        setIsPreviewLoading(false);
      }
    }
  };

  const fetchNfts = async () => {
    console.log("running");
    // const moralisEndpoint = `https://deep-index.moralis.io/api/v2/${account}/nft?chain=eth&format=decimal&normalizeMetadata=true`;
    const options = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/0xA0cb079D354b66188f533A919d1c58cd67aFe398/nft`,
      params: {
        chain: "eth",
        format: "decimal",
        limit: "30",
        // cursor: pageDetails[pageId - 1]?.cursor,
        normalizeMetadata: "true",
      },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_KEY,
      },
    };
    const response = await axios.request(options as any);
    const json = response.data;
    if (json.result?.length) {
      const filteredRecords = (json.result as MoralisNftData[])
        .filter(
          (x) => x.contract_type === "ERC721" && x.token_uri
          // &&
          // (x.normalized_metadata.name
          //   ? x.normalized_metadata.animation_url
          //   : true)
        )
        .map((r) => {
          if (r.normalized_metadata.image) {
            return {
              ...r,
              artworkUrl: createUrlFromCid(r.normalized_metadata.image),
            };
          } else {
            return r;
          }
        });
      console.log(filteredRecords);
      setTokens(filteredRecords);
    }
  };

  useEffect(() => {
    if (account) {
      fetchNfts();
    }
  }, [account]);

  if (!account)
    return (
      <Box display={"flex"} justifyContent="center" my={6}>
        <Button onClick={onConnect} variant="contained">
          Connect Wallet
        </Button>
      </Box>
    );
  else
    return (
      <Box display={"flex"} gap={1} mt={5} sx={{ overflowX: "auto" }}>
        {tokens.length === 0 && (
          <Typography color={"yellow"} align="center" width={"100%"}>
            NFTs not found in your wallet
          </Typography>
        )}
        {tokens.map((nft) => (
          <Stack width={280} p={2} gap={2} borderTop="1px solid #474747">
            <Box>
              <Tooltip title={nft.name} placement="bottom-start">
                <Typography fontWeight={900} noWrap>
                  {nft.name}
                </Typography>
              </Tooltip>
              <Tooltip
                title={`Token ID: ${nft.token_id}`}
                placement="bottom-start"
              >
                <Typography variant="body1" noWrap>
                  #{nft.token_id}
                </Typography>
              </Tooltip>
            </Box>
            {nft.artworkUrl ? (
              <Box
                display={"flex"}
                alignItems="center"
                justifyContent={"center"}
                width="100%"
                height={"100%"}
              >
                <img
                  src={nft.artworkUrl}
                  alt=""
                  width={150}
                  height={150}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                ></img>
              </Box>
            ) : (
              <Box
                display={"flex"}
                alignItems="center"
                justifyContent={"center"}
                width="100%"
                height={"100%"}
              >
                <Box
                  width={200}
                  height={200}
                  display="flex"
                  alignItems={"center"}
                >
                  <Typography align="center" color={"gray"}>
                    Image not available at this moment, you can hit Refresh to
                    see it
                  </Typography>
                </Box>
              </Box>
            )}
            <Box
              id="isnft"
              width={"100%"}
              display="flex"
              justifyContent={"center"}
              alignItems="center"
              gap={4}
              mt={4}
            >
              {/* <Typography>is it a Music NFT?</Typography> */}
              <Button
                disabled={isPreviewLoading}
                variant="outlined"
                color="info"
                onClick={() => {
                  if (nft.artworkUrl) {
                    onInsert(nft);
                  } else {
                    onNftSelect(nft);
                  }
                }}
              >
                {nft.artworkUrl ? "Insert" : "Refresh"}
              </Button>
            </Box>
          </Stack>
        ))}
      </Box>
    );
};

export default NftsByWallet;
