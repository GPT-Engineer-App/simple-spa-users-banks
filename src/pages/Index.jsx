import React, { useState, useEffect } from "react";
import { ChakraProvider, Container, VStack, Text, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const Index = () => {
  const [users, setUsers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBank, setCurrentBank] = useState(null);

  useEffect(() => {
    // Fetch initial data
    fetchData("https://random-data-api.com/api/users/random_user?size=5").then((data) => setUsers(data));
    fetchData("https://random-data-api.com/api/bank/random_bank?size=5").then((data) => setBanks(data));
  }, []);

  const handleAddUsers = async (amount) => {
    const newUsers = await fetchData(`https://random-data-api.com/api/users/random_user?size=${amount}`);
    setUsers([...users, ...newUsers]);
  };

  const handleAddBanks = async (amount) => {
    const newBanks = await fetchData(`https://random-data-api.com/api/bank/random_bank?size=${amount}`);
    setBanks([...banks, ...newBanks]);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsUserModalOpen(true);
  };

  const handleEditBank = (bank) => {
    setCurrentBank(bank);
    setIsBankModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleDeleteBank = (bankId) => {
    if (users.some((user) => user.bank_id === bankId)) {
      alert("Cannot delete bank with associated users.");
      return;
    }
    setBanks(banks.filter((bank) => bank.id !== bankId));
  };

  const handleSaveUser = () => {
    setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
    setIsUserModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveBank = () => {
    setBanks(banks.map((bank) => (bank.id === currentBank.id ? currentBank : bank)));
    setIsBankModalOpen(false);
    setCurrentBank(null);
  };

  return (
    <ChakraProvider>
      <Container centerContent maxW="container.xl" py={4}>
        <VStack spacing={4} width="100%">
          <Text fontSize="2xl">Users</Text>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={() => handleAddUsers(1)}>
            Add User
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.first_name}</Td>
                  <Td>{user.last_name}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEditUser(user)} />
                    <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDeleteUser(user.id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Text fontSize="2xl">Banks</Text>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={() => handleAddBanks(1)}>
            Add Bank
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Bank Name</Th>
                <Th>Routing Number</Th>
                <Th>SWIFT/BIC</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {banks.map((bank) => (
                <Tr key={bank.id}>
                  <Td>{bank.id}</Td>
                  <Td>{bank.bank_name}</Td>
                  <Td>{bank.routing_number}</Td>
                  <Td>{bank.swift_bic}</Td>
                  <Td>
                    <IconButton aria-label="Edit" icon={<FaEdit />} onClick={() => handleEditBank(bank)} />
                    <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDeleteBank(bank.id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Container>

      {/* User Modal */}
      <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input value={currentUser?.first_name || ""} onChange={(e) => setCurrentUser({ ...currentUser, first_name: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input value={currentUser?.last_name || ""} onChange={(e) => setCurrentUser({ ...currentUser, last_name: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input value={currentUser?.username || ""} onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input value={currentUser?.email || ""} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Bank</FormLabel>
              <Select value={currentUser?.bank_id || ""} onChange={(e) => setCurrentUser({ ...currentUser, bank_id: e.target.value })}>
                <option value="">None</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.bank_name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveUser}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bank Modal */}
      <Modal isOpen={isBankModalOpen} onClose={() => setIsBankModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Bank</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Bank Name</FormLabel>
              <Input value={currentBank?.bank_name || ""} onChange={(e) => setCurrentBank({ ...currentBank, bank_name: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Routing Number</FormLabel>
              <Input value={currentBank?.routing_number || ""} onChange={(e) => setCurrentBank({ ...currentBank, routing_number: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>SWIFT/BIC</FormLabel>
              <Input value={currentBank?.swift_bic || ""} onChange={(e) => setCurrentBank({ ...currentBank, swift_bic: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveBank}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsBankModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default Index;
