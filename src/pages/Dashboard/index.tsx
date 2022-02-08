import { useState } from 'react';

import api from '../../services/api';
import { FoodsContainer } from './styles';
import { Food } from '../../components/Food';
import { Header } from '../../components/Header';
import { useEffect } from 'react';
import { ModalEditFood } from '../../components/ModalEditFood';
import { ModalAddFood } from '../../components/ModalAddFood';

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

interface FoodAddProps {
  name: string;
  description: string;
  price: number;
  image: string;
};

interface FoodEditingProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export function Dashboard() {
  const [ foods, setFoods ] = useState<FoodProps[]>([]);
  const [ editingFood, setEditingFood ] = useState<FoodEditingProps>({}  as FoodEditingProps);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ editModalOpen, setEditModalOpen ] = useState(false);
  
  useEffect(() => {
      async function load(){
        const response = await api.get('/foods');
        setFoods(response.data);
      }
      load();
  },[]); 

  async function handleAddFood(food: FoodAddProps) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodEditingProps) {
    try {
      if ( editingFood ) {
        const foodUpdated = await api.put(
          `/foods/${editingFood.id}`,
          { ...editingFood, ...food },
        );
  
        const foodsUpdated = foods.map(f =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data,
        );
        setFoods(foodsUpdated);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter(food => food.id !== id);

      setFoods(foodsFiltered);
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodEditingProps) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDeleteFood={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};
