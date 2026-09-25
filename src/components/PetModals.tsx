import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Pet } from '../types/index.ts';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose }) => {
  const { addPet } = useApp();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat' | 'Other'>('Dog');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState(2);
  const [gender, setGender] = useState<'Male (Neutered)' | 'Male (Intact)' | 'Female (Spayed)' | 'Female (Intact)'>('Male (Neutered)');
  const [weightKg, setWeightKg] = useState(24);
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'
  );
  const [allergies, setAllergies] = useState('None');
  const [notes, setNotes] = useState('Friendly, loves outdoor playtime.');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addPet({
      name,
      species,
      breed: breed || (species === 'Dog' ? 'Mixed Breed Dog' : 'Domestic Cat'),
      ageYears: Number(ageYears),
      ageMonths: 0,
      gender,
      weightKg: Number(weightKg),
      photoUrl,
      healthStatus: 'Healthy',
      microchipId: `985-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
      activeStatusNote: 'Resting at home',
      safetyProfile: {
        safeZoneName: 'Home Perimeter',
        safeZoneRadiusKm: 1.0,
        walkerNotes: notes,
        allowedTreats: 'Healthy organic treats only',
        allergies,
        dietaryNotes: 'Standard balanced diet',
      },
      emergencyContacts: [
        {
          name: 'Oakwood Vet Hospital',
          role: '24/7 ER Vet',
          phone: '+1 555-0192',
          is24_7Vet: true,
        },
      ],
      vaccinations: [
        {
          name: 'Rabies Core',
          validUntil: 'Nov 2026',
          status: 'Up to Date',
        },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-[#dde2f3] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">pets</span>
            <h3 className="font-headline font-bold text-headline-sm text-on-surface">Add New Pet</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-on-surface block mb-1">Pet Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Buster"
              className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface focus:outline-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-on-surface block mb-1">Species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as any)}
                className="w-full h-9 px-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-on-surface block mb-1">Breed</label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Beagle"
                className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-on-surface block mb-1">Age (Years)</label>
              <input
                type="number"
                min="0"
                max="25"
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface"
              />
            </div>
            <div>
              <label className="font-semibold text-on-surface block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="100"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-on-surface block mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full h-9 px-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface"
            >
              <option value="Male (Neutered)">Male (Neutered)</option>
              <option value="Male (Intact)">Male (Intact)</option>
              <option value="Female (Spayed)">Female (Spayed)</option>
              <option value="Female (Intact)">Female (Intact)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-on-surface block mb-1">Allergies / Special Notes</label>
            <textarea
              rows={2}
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Sensitive stomach, pollen allergies..."
              className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface"
            />
          </div>

          <div>
            <label className="font-semibold text-on-surface block mb-1">Walker &amp; Caregiver Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loves tennis balls, polite on leash..."
              className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl bg-surface-container-low text-on-surface font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-primary text-on-primary font-bold shadow-xs hover:opacity-95"
            >
              Add Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditPetModalProps {
  pet: Pet | null;
  onClose: () => void;
}

export const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose }) => {
  const { updatePet, deletePet } = useApp();

  const [name, setName] = useState(pet?.name || '');
  const [breed, setBreed] = useState(pet?.breed || '');
  const [weightKg, setWeightKg] = useState(pet?.weightKg || 30);
  const [walkerNotes, setWalkerNotes] = useState(pet?.safetyProfile.walkerNotes || '');
  const [allergies, setAllergies] = useState(pet?.safetyProfile.allergies || '');

  if (!pet) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePet(pet.id, {
      name,
      breed,
      weightKg: Number(weightKg),
      safetyProfile: {
        ...pet.safetyProfile,
        walkerNotes,
        allergies,
      },
    });
    onClose();
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to remove ${pet.name} from your profile?`)) {
      await deletePet(pet.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-[#dde2f3] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
          <h3 className="font-headline font-bold text-headline-sm text-on-surface">
            Edit {pet.name}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-on-surface block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low"
            />
          </div>

          <div>
            <label className="font-semibold text-on-surface block mb-1">Breed</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low"
            />
          </div>

          <div>
            <label className="font-semibold text-on-surface block mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full h-9 px-3 rounded-xl border border-outline-variant bg-surface-container-low"
            />
          </div>

          <div>
            <label className="font-semibold text-on-surface block mb-1">Allergies</label>
            <textarea
              rows={2}
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low"
            />
          </div>

          <div>
            <label className="font-semibold text-on-surface block mb-1">Caregiver Notes</label>
            <textarea
              rows={2}
              value={walkerNotes}
              onChange={(e) => setWalkerNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-low"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 h-10 rounded-xl bg-error-container text-error font-semibold hover:opacity-90"
            >
              Delete
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-xl bg-primary text-on-primary font-bold shadow-xs hover:opacity-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
