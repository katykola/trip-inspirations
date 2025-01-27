import { useState, useEffect } from 'react';
import { Button, Modal, Stack, Typography, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, TextField, Checkbox, ListItemText } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useCollections } from '../hooks/useCollections';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase-config';
import { collection, addDoc } from 'firebase/firestore';

interface AddToCollectionProps {
  getCollectionId: (collectionId: string) => void;
  initialCollectionId: string | null;
}

export default function AddToCollection({ getCollectionId, initialCollectionId }: AddToCollectionProps) {

  const [open, setOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [showNewCollectionFields, setShowNewCollectionFields] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid || '';
  const { data: collections, isLoading, error, refetch } = useCollections(userId);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowNewCollectionFields(false);
    setNewCollectionTitle('');
  };

  useEffect(() => {
    if (initialCollectionId) {
      setSelectedCollection(initialCollectionId);
    }
  }, [initialCollectionId]);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedCollection(event.target.value as string);
    getCollectionId(event.target.value as string);
    setOpen(false);
  };

  const handleNewCollectionTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCollectionTitle(event.target.value);
  };

  const handleAddCollection = async () => {
    if (newCollectionTitle.trim()) {
      try {
        const newCollectionRef = await addDoc(collection(db, 'collections'), {
          title: newCollectionTitle,
          userId: userId,
        });
        setNewCollectionTitle('');
        setSelectedCollection(newCollectionRef.id);
        getCollectionId(newCollectionRef.id);
        refetch(); // Refetch collections to include the new collection
        handleClose();
      } catch (error) {
        console.error('Error adding new collection:', error);
      }
    } else {
      console.error('Collection title is empty. Not creating a new collection.');
    }
  };

  const selectedCollectionTitle = collections?.find(collection => collection.id === selectedCollection)?.title || newCollectionTitle;

  return (
    <>
      <Button variant='outlined' color='secondary' onClick={handleOpen} startIcon={selectedCollection || newCollectionTitle ? <BookmarkIcon /> : <BookmarkBorderIcon />}>
        {selectedCollectionTitle.trim() ? (
          <Typography>{selectedCollectionTitle}</Typography>
        ) : (
          <Typography>{initialCollectionId || 'Add to collection'}</Typography>
        )}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="select-collection-modal-title"
        aria-describedby="select-collection-modal-description"
      >
        <Stack
          spacing={2}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          {!showNewCollectionFields && (
          <>
          <Typography id="select-collection-modal-title" variant="h6" component="h2">
            Select Collection
          </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-collection-label">Collection</InputLabel>
              <Select
                labelId="select-collection-label"
                id="select-collection"
                value={selectedCollection}
                label="Collection"
                onChange={handleSelectChange}
                renderValue={(selected) => {
                  const selectedCollection = collections?.find((collection) => collection.id === selected);
                  return selectedCollection ? selectedCollection.title : '';
                }}
              >
                {isLoading && <MenuItem disabled>Loading...</MenuItem>}
                {error && <MenuItem disabled>Error loading collections</MenuItem>}
                {collections && collections.map((collection) => (
                  <MenuItem
                    key={collection.id}
                    value={collection.id}
                    onClick={() => {
                      if (selectedCollection === collection.id) {
                        // Deselect collection
                        setSelectedCollection('');
                        getCollectionId('');
                      } else {
                        // Select collection
                        setSelectedCollection(collection.id);
                        getCollectionId(collection.id);
                      }
                    }}
                  >
                    <Checkbox
                      checked={selectedCollection === collection.id}
                      value={collection.id}
                    />
                    <ListItemText primary={collection.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => setShowNewCollectionFields(true)}
          >
            Add New
          </Button>
            </>
          )}
          {showNewCollectionFields && (
            <>
            <Typography variant="h6">Create Collection</Typography>
              <TextField
                fullWidth
                placeholder="Collection name"
                value={newCollectionTitle}
                onChange={handleNewCollectionTitleChange}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleAddCollection}
              >
                Add
              </Button>
            </>
          )}
        </Stack>
      </Modal>
    </>
  );
}