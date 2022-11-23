import {
  Box,
  Center,
  Spacer,
  Stack,
  Image,
  Button,
  HStack,
  Text,
  VStack,
  Heading,
  Container,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import NavBar from "../components/NavBar";
import Disconnected from "../components/Disconnected";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Connected from "../components/Connected";
import {
  useCallback,
  MouseEventHandler,
  useMemo,
  useState,
  useEffect,
} from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

interface NewMintProps {
  mint: PublicKey;
}

const NewMint: NextPage<NewMintProps> = ({ mint }) => {
  const { connected } = useWallet();
  const { connection } = useConnection();
  const [metadata, setMetadata] = useState<any>();

  const walletAdapter = useWallet();

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {},
    []
  );

  const findByMint = async () => {
    try {
      const nft = await metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(mint) });
    } catch (error) {}
  };

  useEffect(() => {
    // What this does is to allow us to find the NFT object
    // based on the given mint address
    if (mint) {
      metaplex
        .nfts()
        .findByMint({ mintAddress: new PublicKey(mint) })
        .then((nft) => {
          // We then fetch the NFT uri to fetch the NFT metadata
          fetch(nft.uri)
            .then((res) => res.json())
            .then((metadata) => {
              setMetadata(metadata);
            });
        });
    }
  }, [mint, metaplex, walletAdapter]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Buildoors</title>
        <meta name="The NFT Collection for Buildoors" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        w="full"
        h="calc(100vh)"
        bgImage={"url(/home-background.svg)"}
        backgroundPosition="center"
      >
        <Stack w="full" h="calc(100vh)" justify="center">
          {/* NavBar */}
          <NavBar />

          <Spacer />
          <Center>
            <VStack spacing={20}>
              <Container>
                <VStack spacing={8}>
                  <Heading
                    color="white"
                    as="h1"
                    size="2xl"
                    noOfLines={1}
                    textAlign="center"
                  >
                    Congrats on the new mint
                  </Heading>

                  <Text color="bodyText" fontSize="xl" textAlign="center">
                    Time to stake to earn rewards
                  </Text>
                </VStack>
              </Container>

              <HStack spacing={10}>
                <Image
                  width={300}
                  height={300}
                  src={metadata?.image ?? ""}
                  alt=""
                />
              </HStack>
              <Button
                bgColor="accent"
                color="white"
                maxWidth="380px"
                onClick={handleClick}
              >
                <HStack>
                  <Text>stake my buildoor</Text>
                  <ArrowForwardIcon />
                </HStack>
              </Button>
            </VStack>
          </Center>
          <Spacer />
          <Center>
            <Box marginBottom={4} color="white">
              <a
                href="https://twitter.com/_buildspace"
                target="_blank"
                rel="noopener noreferrer"
              >
                built with @_buildspace
              </a>
            </Box>
          </Center>
        </Stack>
      </Box>
    </div>
  );
};

export default NewMint;

NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query;
  if (!mint) throw { error: "No mint" };

  try {
    const mintPubkey = new PublicKey(mint);
    return { mint: mintPubkey };
  } catch {
    throw { error: "Invalid mint" };
  }
};
