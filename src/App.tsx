import { useState, useEffect } from 'react';
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: Ingredient[];
  instructions: string;
  portions: number;
  basePortions: number;
}

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%);
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  && {
    margin: 1rem 0;
    background: rgba(45, 52, 54, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    transition: transform 0.2s;
    color: #fff;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }

    .MuiTypography-root {
      color: #fff;
    }

    .MuiIconButton-root {
      color: #dfe6e9;
      &:hover {
        color: #74b9ff;
      }
    }
  }
`;

const Title = styled(Typography)`
  && {
    color: #74b9ff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    font-weight: bold;
    margin-bottom: 2rem;
  }
`;

const PortionControls = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    id: 0,
    name: "",
    ingredients: [],
    instructions: "",
    portions: 4,
    basePortions: 4,
  });

  useEffect(() => {
    if (recipes.length === 0) {
      const boilerplateRecipes: Recipe[] = [
        {
          id: 1,
          name: "Classic Spaghetti Carbonara",
          ingredients: [
            { name: "Spaghetti", amount: 400, unit: "g" },
            { name: "Eggs", amount: 4, unit: "pcs" },
            { name: "Pecorino Romano", amount: 100, unit: "g" },
            { name: "Guanciale", amount: 150, unit: "g" },
          ],
          instructions: "1. Cook pasta\n2. Fry guanciale\n3. Mix eggs and cheese\n4. Combine all ingredients",
          portions: 4,
          basePortions: 4,
        },
        {
          id: 2,
          name: "Chicken Tikka Masala",
          ingredients: [
            { name: "Chicken breast", amount: 600, unit: "g" },
            { name: "Yogurt", amount: 200, unit: "ml" },
            { name: "Tomato sauce", amount: 400, unit: "ml" },
            { name: "Spices", amount: 30, unit: "g" },
          ],
          instructions: "1. Marinate chicken\n2. Grill chicken\n3. Prepare sauce\n4. Combine",
          portions: 4,
          basePortions: 4,
        },
        // Add 3 more recipes here...
      ];
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleUpdatePortions = (id: number, change: number) => {
    setRecipes(recipes.map(recipe => {
      if (recipe.id === id) {
        const newPortions = Math.max(1, recipe.portions + change);
        const ratio = newPortions / recipe.basePortions;
        const updatedIngredients = recipe.ingredients.map(ing => ({
          ...ing,
          amount: Number((ing.amount * ratio).toFixed(2))
        }));
        return { ...recipe, portions: newPortions, ingredients: updatedIngredients };
      }
      return recipe;
    }));
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setNewRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleSaveRecipe = () => {
    if (editingRecipe) {
      setRecipes(recipes.map(r => r.id === editingRecipe.id ? newRecipe : r));
    } else {
      setRecipes([...recipes, { ...newRecipe, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    setEditingRecipe(null);
    setNewRecipe({
      id: 0,
      name: "",
      ingredients: [],
      instructions: "",
      portions: 4,
      basePortions: 4,
    });
  };

  return (
    <AppContainer>
      <Title variant="h3" component="div">
        Funky Recipe Book 🍳
      </Title>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsDialogOpen(true)}
        sx={{ 
          mb: 3,
          background: '#74b9ff',
          '&:hover': {
            background: '#0984e3'
          }
        }}
      >
        Add New Recipe
      </Button>

      <Stack spacing={2}>
        {recipes.map((recipe) => (
          <StyledCard key={recipe.id}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {recipe.name}
              </Typography>
              
              <PortionControls>
                <IconButton 
                  onClick={() => handleUpdatePortions(recipe.id, -1)}
                  disabled={recipe.portions <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>
                  {recipe.portions} portions
                </Typography>
                <IconButton onClick={() => handleUpdatePortions(recipe.id, 1)}>
                  <AddIcon />
                </IconButton>
              </PortionControls>

              <Typography variant="h6">Ingredients:</Typography>
              {recipe.ingredients.map((ing, idx) => (
                <Typography key={idx}>
                  • {ing.amount} {ing.unit} {ing.name}
                </Typography>
              ))}

              <Typography variant="h6" sx={{ mt: 2 }}>Instructions:</Typography>
              <Typography>{recipe.instructions}</Typography>
            </CardContent>
            
            <CardActions>
              <IconButton onClick={() => handleEditRecipe(recipe)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => setRecipes(recipes.filter(r => r.id !== recipe.id))}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </StyledCard>
        ))}
      </Stack>

      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: '#2d3436',
            color: '#fff',
            '.MuiDialogTitle-root': {
              color: '#74b9ff'
            },
            '.MuiInputLabel-root': {
              color: '#dfe6e9'
            },
            '.MuiOutlinedInput-root': {
              color: '#fff',
              '& fieldset': {
                borderColor: '#636e72'
              },
              '&:hover fieldset': {
                borderColor: '#74b9ff'
              }
            },
            '.MuiButton-root': {
              color: '#dfe6e9'
            }
          }
        }}
      >
        <DialogTitle>
          {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Recipe Name"
              fullWidth
              value={newRecipe.name}
              onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
            />
            <TextField
              label="Instructions"
              fullWidth
              multiline
              rows={4}
              value={newRecipe.instructions}
              onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
            />
            {/* Add more fields for ingredients */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRecipe} variant="contained" color="primary">
            Save Recipe
          </Button>
        </DialogActions>
      </Dialog>
    </AppContainer>
  );
}

export default App;
