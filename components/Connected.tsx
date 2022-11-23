import { FC } from "react";
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useCallback, MouseEventHandler } from "react";
import { useRouter } from "next/router";
import {
  Metaplex,
  walletAdapterIdentity,
  CandyMachineV2,
} from "@metaplex-foundation/js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import candy from "../tokens/candy-machine/cache.json";
import { PublicKey } from "@solana/web3.js";

const Connected: FC = () => {
  const router = useRouter();
  const candyAddress = candy.program.candyMachine;
  const [isMinting, setIsMinting] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
  const [candyMachine, setCandyMachine] = useState<CandyMachineV2>();

  console.log({ wallet });

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      console.log("clicking");
      if (event.defaultPrevented) return;
      console.log("clicking2");

      if (!wallet.connected || !candyMachine) return;
      console.log("clicking3");

      try {
        setIsMinting(true);
        const cm = await metaplex
          .candyMachinesV2()
          .findByAddress({ address: new PublicKey(candyAddress) });
        console.log({ cm });
        const nft = await metaplex.candyMachinesV2().mint({ candyMachine });

        console.log(nft);
        router.push(`/newMint?mint=${nft.nft.address.toBase58()}`);
      } catch (error) {
        console.log({ error });
        alert(error);
      } finally {
        setIsMinting(false);
      }
    },
    [candyAddress, candyMachine, metaplex, router, wallet.connected] //walletAdapter
  );

  const fetchCandyMachine = useCallback(async () => {
    const cm = await metaplex
      .candyMachinesV2()
      .findByAddress({ address: new PublicKey(candyAddress) });
    console.log({ cm });
    setCandyMachine(cm);
  }, [candyAddress]);

  // const getUserNfts = async () => {
  //   try {
  //     const userNfts = await metaplex
  //       .nfts()
  //       .findAllByOwner({ owner: wallet.publicKey as PublicKey });
  //     console.log({ userNfts });
  //   } catch (error) {}
  // };

  useEffect(() => {
    console.log("THIS IS A USE EFFECT");
    fetchCandyMachine();
    // getUserNfts();
  }, [fetchCandyMachine]);
  return (
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
            Welcome Buildoor.
          </Heading>

          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each buildoor is randomly generated and can be staked to receive
            <Text as="b"> $BLD</Text> Use your <Text as="b"> $BLD</Text> to
            upgrade your buildoor and receive perks within the community!
          </Text>
        </VStack>
      </Container>

      <HStack spacing={10}>
        <Image src="avatar1.png" alt="" />
        <Image src="avatar2.png" alt="" />
        <Image src="avatar3.png" alt="" />
        <Image src="avatar4.png" alt="" />
        <Image src="avatar5.png" alt="" />
      </HStack>

      <Button bgColor="accent" color="white" maxW="380px" onClick={handleClick}>
        <HStack>
          <Text>mint buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  );
};

export default Connected;
