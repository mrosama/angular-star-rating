import angular = require('angular');
import ngMock = require('angular-mocks');

import IRootScopeService = angular.IRootScopeService;

import './index.ts';
import IComponentController = angular.IComponentController;
import {StarRatingController, IStarRatingCompBindings, starRatingColors} from "./star-rating.controller";
import {StarRatingComponent} from "./star-rating.component";

describe('Controller Test', () => {
    console.log('Controller Test');
    let $componentController;
    let starRatingCtrl;
    let scope;

    let negativeValue: number = -1;
    let defaultValue: number = 0;

    let defaultColor: starRatingColors = "default";
    let negativeColor: starRatingColors = "negative";
    let okColor: starRatingColors = "middle";
    let positiveColor: starRatingColors = "positive";

    let lowRating = 1;
    let okRating = 3;
    let highRating = 5;

    beforeEach(angular.mock.module('star-rating'));

    beforeEach(inject(($rootScope, _$componentController_) => {
        scope = $rootScope.$new();
        $componentController = _$componentController_;
    }));

    it('should console.log TEST', () => {
        console.log('TEST');
    });


    it('should expose a `starRatingComp` object', () => {
        starRatingCtrl = getStarRatingCtrl();

        expect(starRatingCtrl).toBeDefined();
        expect(typeof starRatingCtrl.onStarClicked).toBe('function');
    });

    it('should contain proper default values if no bindings are set', () => {
        starRatingCtrl = getStarRatingCtrl();

        //bindings
        //@
        expect(starRatingCtrl.id).toBe(undefined);
        //<
        expect(starRatingCtrl.text).toBe(undefined);
        expect(typeof starRatingCtrl.color).toBe("string");
        expect(starRatingCtrl.color).toBe(starRatingCtrl._getColor(starRatingCtrl.rating, starRatingCtrl.numOfStars));
        expect(starRatingCtrl.labelPosition).toBe(undefined);
        expect(starRatingCtrl.speed).toBe(undefined);
        expect(starRatingCtrl.size).toBe(undefined);
        expect(starRatingCtrl.starType).toBe(undefined);
        expect(starRatingCtrl.spread).toBe(undefined);
        expect(starRatingCtrl.readOnly).toBe(undefined);
        expect(starRatingCtrl.disabled).toBe(undefined);
        expect(starRatingCtrl.rating).toBe(undefined);
        expect(starRatingCtrl.numOfStars).toBe(StarRatingController.DefaultNumOfStars);
        expect(typeof starRatingCtrl.getColor).toBe("function");
        expect(typeof starRatingCtrl.getHalfStarVisible).toBe("function");
        //&
        expect(typeof starRatingCtrl.onUpdate).toBe("function");
        expect(typeof starRatingCtrl.onClick).toBe("function");

        //ctrl only
        expect(starRatingCtrl.classEmpty).toBe(StarRatingController.DefaultClassEmpty);
        expect(starRatingCtrl.classFilled).toBe(StarRatingController.DefaultClassFilled);
        expect(starRatingCtrl.pathEmpty).toBe(StarRatingController.DefaultSvgPathEmpty);
        expect(starRatingCtrl.pathFilled).toBe(StarRatingController.DefaultSvgPathFilled);
        expect(typeof starRatingCtrl.stars).toBe("object");
        expect(starRatingCtrl.stars.length).toBe(StarRatingController.DefaultNumOfStars);
        expect(starRatingCtrl.stars[0]).toBe(1);
        expect(starRatingCtrl.staticColor).toBe(undefined);
    });

    it('should set custom bindings properly', () => {
        let bindings = <IStarRatingCompBindings>{
            //@
            id: 'custom-id'
            //<
            , text: 'custom-text'
            , staticColor: 'positive'
            , labelPosition: 'right'
            , speed: 'immediately'
            , size: 'small'
            , starType: 'icon'
            , spread: true
            , readOnly: true
            , disabled: true
            , rating: 3
            , numOfStars: 8
            , getColor: function (rating, numOfStars, staticColor) {
                return this.color
            }, getHalfStarVisible: function (rating) {
                return true;
            }
            //&
            , onClick: function ($event) {
                return 'onClick'
            }
            , onUpdate: function ($event) {
                return 'onUpdate'
            }
        };

        starRatingCtrl = getStarRatingCtrl(bindings);

        expect(starRatingCtrl.id).toBe(bindings.id);
        expect(starRatingCtrl.text).toBe(bindings.text);
        expect(starRatingCtrl.color).toBe(bindings.staticColor);
        expect(starRatingCtrl.labelPosition).toBe(bindings.labelPosition);
        expect(starRatingCtrl.speed).toBe(bindings.speed);
        expect(starRatingCtrl.size).toBe(bindings.size);
        expect(starRatingCtrl.starType).toBe(bindings.starType);
        expect(starRatingCtrl.spread).toBe(bindings.spread);
        expect(starRatingCtrl.readOnly).toBe(bindings.readOnly);
        expect(starRatingCtrl.disabled).toBe(bindings.disabled);
        expect(starRatingCtrl.rating).toBe(bindings.rating);
        expect(starRatingCtrl.getColor(1, 5)).toBe(bindings.getColor(1, 5));
        expect(starRatingCtrl.getHalfStarVisible(1)).toBe(bindings.getHalfStarVisible(1));
        expect(starRatingCtrl.onClick({rating:1})).toBe(bindings.onClick({$event:{rating:1}}));
        //expect(starRatingCtrl.onUpdate({rating:1})).toBe(bindings.onUpdate({$event:{rating:1}}));
    });


    it("should return proper values when firing _getColor function", () => {

        let testValues = {};
        testValues[negativeValue] = defaultColor;
        testValues[defaultValue] = defaultColor;
        testValues[lowRating] = negativeColor;
        testValues[okRating] = okColor;
        testValues[highRating] = positiveColor;

        starRatingCtrl = getStarRatingCtrl({});

        let numOfStars = StarRatingController.DefaultNumOfStars;
        let staticColor = negativeColor;

        //test with required properties
        for (let rating in testValues) {
            expect(starRatingCtrl._getColor(rating, numOfStars)).toBe(testValues[rating]);
        }

        //test with optional staticColor property
        for (let rating in testValues) {
            expect(starRatingCtrl._getColor(rating, numOfStars,staticColor)).toBe(negativeColor);
        }

    });

    it("should return proper values when firing _getHalfStarVisible function", () => {

        let testValues = {};
        testValues[negativeValue+0.5] = true;
        testValues[defaultValue+0.5] = true;
        testValues[lowRating+0.5] = true;
        testValues[okRating+0.5] = true;

        testValues[lowRating+0.1] = true;
        testValues[lowRating+0.2] = true;
        testValues[lowRating+0.3] = true;
        testValues[lowRating+0.4] = true;

        testValues[lowRating+0.6] = true;
        testValues[lowRating+0.7] = true;
        testValues[lowRating+0.8] = true;
        testValues[lowRating+0.9] = true;

        testValues[negativeValue+0.1] = true;
        testValues[negativeValue+0.2] = true;
        testValues[negativeValue+0.3] = true;
        testValues[negativeValue+0.4] = true;

        testValues[negativeValue+0.6] = true;
        testValues[negativeValue+0.7] = true;
        testValues[negativeValue+0.8] = true;
        testValues[negativeValue+0.9] = true;

        testValues[negativeValue] = false;
        testValues[defaultValue] = false;
        testValues[lowRating] = false;
        testValues[okRating] = false;
        testValues[highRating] = false;

        starRatingCtrl = getStarRatingCtrl({});

        //test default calculation
        for (let rating in testValues) {
            expect(starRatingCtrl._getHalfStarVisible(rating)).toBe(testValues[rating]);
        }

    });


    it("should return proper values when firing updateNumOfStars function", () => {

        let lowNumOfStars = 1;
        let defaultNumOfStars = 6;
        let highNumOfStars = 15;

        let testValues = {};
        testValues[negativeValue] = okColor;
        testValues[defaultValue] = okColor;
        testValues[lowNumOfStars] = positiveColor;
        testValues[defaultNumOfStars] = okColor;
        testValues[highNumOfStars] = negativeColor;

        let bindings = <IStarRatingCompBindings>{
            rating: 3
        };

        for (let numOfStars in testValues) {
            bindings.numOfStars = parseInt(numOfStars);
            starRatingCtrl = getStarRatingCtrl(bindings);
            starRatingCtrl.updateNumOfStars(starRatingCtrl.numOfStars);

            //@TODO spy on StarRatingController.getStarsArray
            let expectedNumOfStars = (numOfStars && parseInt(numOfStars) > 0)?parseInt(numOfStars):StarRatingController.DefaultNumOfStars;
            expect(starRatingCtrl.numOfStars).toBe(expectedNumOfStars);
            //@TODO spy on getColor
            expect(starRatingCtrl.color).toBe(testValues[numOfStars]);
            expect(typeof starRatingCtrl.stars).toBe("object");
            expect(starRatingCtrl.stars.length).toBe(parseInt(starRatingCtrl.numOfStars));
            expect(starRatingCtrl.stars[0]).toBe(1);
        }
    });

    it("should return proper values when firing updateRating function", () => {

        let testValues = {};
        testValues[negativeValue] = defaultColor;
        testValues[defaultValue] = defaultColor;
        testValues[lowRating] = negativeColor;
        testValues[okRating] = okColor;
        testValues[highRating] = positiveColor;

        let newRatingValue;
        let bindings:IStarRatingCompBindings = {
            //onUpdate : onUpdate
        };

        starRatingCtrl = getStarRatingCtrl(bindings);

        for (let rating in testValues) {
            starRatingCtrl.updateRating(rating);

            expect(starRatingCtrl.rating).toBe(rating);
            expect(newRatingValue).toBe(starRatingCtrl.rating);

            //@TODO spy on getColor

            expect(starRatingCtrl.color).toBe(testValues[rating]);

            //@TODO spy on onUpdate
        }

        /////////////////////////

        function onUpdate(updateObject) {
            newRatingValue = updateObject.rating;
        }

    });

    it("should return proper values when firing onStarClicked function", () => {

        let lowRating = 1;
        let okRating = 3;
        let highRating = 5;

        let testValues = {};
        testValues[negativeValue] = defaultColor;
        testValues[defaultValue] = defaultColor;
        testValues[lowRating] = negativeColor;
        testValues[okRating] = okColor;
        testValues[highRating] = positiveColor;

        starRatingCtrl = getStarRatingCtrl();

        //default values
        for (let rating in testValues) {
            starRatingCtrl.onStarClicked(rating);

            expect(starRatingCtrl.rating).toBe(rating);
            //@TODO spy on updateRating
            expect(starRatingCtrl.color).toBe(testValues[rating]);
            //@TODO spy on onClick
        }

        //@TODO custom onClick function

        //@TODO with readOnly

        //@TODO with disabled
    });

    it("should return proper values when firing getColor function", () => {
        let testValues = {};
        testValues[lowRating] = okColor;
        testValues[okRating] = positiveColor;
        testValues[highRating] = negativeColor;

        let bindings:IStarRatingCompBindings = {
            getColor : customGetColor
        };
        starRatingCtrl = getStarRatingCtrl(bindings);

        //default return values
        let count = 0;
        for (let rating in testValues) {
            starRatingCtrl.updateRating(rating);
            expect(starRatingCtrl.color).toBe(testValues[rating]);
        }

        //return values when staticColor is given
        starRatingCtrl.staticColor = positiveColor;
        for (let rating in testValues) {
            starRatingCtrl.updateRating(rating);
            expect(starRatingCtrl.color).toBe(positiveColor);
        }

        /////////////////////////

        function customGetColor(rating:number, numOfStars:number, staticColor?:starRatingColors) {
            rating = rating || 0;

            //if a fix color is set use this one
            if(staticColor) {
                return staticColor;
            }

            //calculate size of smallest fraction
            let fractionSize = numOfStars / 3;

            //apply color by fraction
            let color:starRatingColors = defaultColor;
            if (rating > 0) { color = okColor; }
            if (rating > fractionSize) { color = positiveColor; }
            if (rating > fractionSize * 2) { color = negativeColor; }

            return color;

        }

    });

    //@TODO implement test
    //it("should return proper values when firing $onChange function", () => {});

    /**
     * getStarRatingCtrl
     *
     * A factory for StarRatingController
     *
     * @param bindingsProperties
     * @returns {*}
     */
    function getStarRatingCtrl(bindingsProperties?: IStarRatingCompBindings): any {
        bindingsProperties = angular.copy(bindingsProperties) || <IStarRatingCompBindings>{};
        return $componentController('starRatingComp', null, bindingsProperties);
    }

});