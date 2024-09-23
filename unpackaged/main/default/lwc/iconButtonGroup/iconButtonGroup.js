/**
 * @file        iconButtonGroup.js
 * @description LWC component that displays a group of buttons, handles selection, and provides info based on the selected button. Outputs the selected value to the parent or a flow.
 * @author      Abdul-Rahman Haddam
 * @company     CirtaTech (cirtatech.com)
 */

import { LightningElement, api, track } from 'lwc';

export default class IconButtonGroup extends LightningElement {
    @api buttonsJson; // Input: JSON string of buttons
    @api defaultSelected; // Input: Default selected button value
    @api headerText; // Input: Header
    
    @track buttons = []; // Array of button objects parsed from JSON
    @track selectedButton; // The value of the selected button
    @track currentInfo; // The text to display in the info area
    
    // Output property
    @api selectedValue; // The currently selected value, to be passed back to the parent or flow

    connectedCallback() {
        console.log('Received buttonsJson:', this.buttonsJson);
        try {
            if (this.buttonsJson && this.buttonsJson.trim() !== '') {
                this.buttons = JSON.parse(this.buttonsJson);
            } else {
                console.error('No valid buttonsJson received.');
            }
        } catch (error) {
            console.error('Failed to parse buttons JSON:', error);
        }

        if (this.buttons.length > 0) {
            this.buttons = this.buttons.map(button => {
                return {
                    ...button,
                    className: button.value === this.defaultSelected ? 'button selected' : 'button'
                };
            });

            const defaultButton = this.buttons.find(button => button.value === this.defaultSelected);
            if (defaultButton) {
                this.selectedButton = defaultButton.value;
                this.currentInfo = defaultButton.infoText;
                this.selectedValue = defaultButton.value;
            }
        }
    }

    handleMouseOver(event) {
        const hoveredValue = event.currentTarget.dataset.value;
        const hoveredButton = this.buttons.find(button => button.value === hoveredValue);
        if (hoveredButton) {
            this.currentInfo = hoveredButton.infoText;
        }
    }

    handleButtonClick(event) {
        const clickedValue = event.currentTarget.dataset.value;
        this.selectedButton = clickedValue;

        this.buttons = this.buttons.map(button => {
            return {
                ...button,
                className: button.value === clickedValue ? 'button selected' : 'button'
            };
        });

        const selectedButton = this.buttons.find(button => button.value === clickedValue);
        if (selectedButton) {
            this.currentInfo = selectedButton.infoText;
        }

        this.selectedValue = clickedValue;
        const selectedEvent = new CustomEvent('buttonselect', {
            detail: { value: this.selectedValue }
        });
        this.dispatchEvent(selectedEvent);
    }
}