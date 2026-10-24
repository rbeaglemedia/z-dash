# Anatomy check

Target `cursor/house-row-styles-52fc` `ae8b9e25e9f4`

Result: **FAIL**

Bar: humanoid at least. Head, then limbs, then the walk. Clothes are secondary.

## 1. Head

Not scored. This tree has no jointed closet.

## 2. Limbs and feet

Not scored. This tree has no jointed closet.

## 3. Walk

Not scored. This tree has no jointed closet.

## 4. Scale

- **The pet is not standing on the floor** `pet-floor`
  NOS & Fuel Depot pet hangs 188px below her feet Ellie's house pet hangs 188px below her feet Showroom shop pet hangs 188px below her feet Speed garage pet hangs 188px below her feet Seen on: NOS & Fuel Depot, Ellie's house, Showroom shop, Speed garage, Dance studio, Pet lounge, Pizza cafe, Pixel arcade, Neon paint studio, Sky tower (+2).
  Shots: shots/interior-nos.png, shots/interior-home.png, shots/interior-showroom.png, shots/interior-garage.png, shots/interior-dance.png, shots/interior-pets.png
- **The pet is taller than the character's hip** `pet-scale`
  NOS & Fuel Depot pet is 2.28× her height (425px against 186px). Her hip is 0.54 of that. Ellie's house pet is 2.30× her height (426px against 185px). Her hip is 0.54 of that. Showroom shop pet is 2.29× her height (426px against 186px). Her hip is 0.54 of that. Speed garage pet is 2.29× her height (426px against 186px). Her hip is 0.54 of that. Seen on: NOS & Fuel Depot, Ellie's house, Showroom shop, Speed garage, Dance studio, Pet lounge, Pizza cafe, Pixel arcade, Neon paint studio, Sky tower (+2).
  Shots: shots/interior-nos.png, shots/interior-home.png, shots/interior-showroom.png, shots/interior-garage.png, shots/interior-dance.png, shots/interior-pets.png

## Secondary

- **Scale check was not run on this tree** This tree has no room-scale drawer, so the hip and floor check was not run here.
- **Garage turntable check was not run on this tree** This tree has no garage turntable pet, so that scale check was not run here.

## Pets

Pass. Joints read as that animal.

## What was rendered

- No jointed closet in this tree, so the head, limb, and walk pixel suite was not scored here
- Pets: fox, cat, dragon, robo joint check
- Scale: pet beside the character in the house, the showroom shop, and outdoors, plus room props on the floor
- Interiors: the pet and the woman measured in the painted room for the depot, the house, the shop, and every other building
