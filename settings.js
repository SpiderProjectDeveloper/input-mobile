﻿import React, { Component } from 'react';
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { Dimensions } from 'react-native';

export const settings = {
		log: false,
		window: Dimensions.get('window'),
		lang: 'en',

		editTableInitialLoad: 40,

		texts: {
			en: {
				server: "Server",
				port: "Port",
				user: "User",
				password: "Password",
				versionShort: 'ver.'
			},
			ru:  {
				server: "Сервер",
				port: "Порт",
				user: "Пользователь",
				password: "Пароль",
				versionShort: 'вер.'
			},
		},

    //loginButton: <AntDesign name="log-in" size={20} color="white"/>,		// "user" / "log-in"
    //logoutButton: <AntDesign name="log-out" size={20} color="white"/>, 	// "logout" / "log-out"
    loginButton: <Feather name="log-in" size={20} color="white"/>,		// "user" / "log-in"
    logoutButton: <Feather name="log-out" size={20} color="white"/>, 	// "logout" / "log-out"
    yesButton: <AntDesign name="check" size={20} color="white"/>,
    noButton: <AntDesign name="close" size={20} color="white"/>,
    backToProjectsButton: <AntDesign name="back" size={20} color="white"/>,	// an alternative icon: "back" / "left"
    saveButton: <AntDesign name="upload" size={20} color="white"/>,	// an alternativr icon: "hdd"
    confirmButton: <Feather name="check" size={20} color="white"/>,		// "user" / "log-in"
    cancelButton: <Feather name="x" size={20} color="white"/>,		// "user" / "log-in"

		loadingIcon: <AntDesign name="loading1" size={28} color="black" />,
		fileIcon: <AntDesign name="file1" size={18} color="#004444" />,

    nextPageDownButton: <AntDesign name="caretdown" size={20} color="lightgray"/>,
		nextPageUpButton: <AntDesign name="caretup" size={20} color="lightgray"/>,

		infoIcon: <AntDesign name="infocirlceo" size={16} color="#2f2f2f" />,
		openProjectIcon: <AntDesign name="rightsquareo" size={18} color="#2f2f2f"/>,

		defaultCellWidth: 140,
		tableCellFontSize:14,

    screenBgColor: '#ffffff',
    screenBgColor2: '#f0f0f0',
    activeButtonBgColor: '#1b73b3',
    inactiveButtonBgColor: '#d0e0e0',
		dimColor: '#afafaf',
		textColor: '#5f5f5f',
		promptColor: '#2f2f2f',
		editableTextColor: '#000000',
		notImportantColor: '#8f8f8f',
		updatedColor: '#ff4444',
    warningColor: '#772222',
    linkColor: '#004444',

    statusLoginRequired: 'loginRequired',
    statusLoggingIn: 'loggingIn',
    statusLoginFailed: 'loginFailed',
    statusLoginRequestFailed: 'loginRequestFailed',
    statusLoggingOut: 'loggingOut',
    statusProjectListBeingLoaded: 'projectListBeingLoaded',
    statusProjectListRequestFailed: 'projectListRequestFailed',
    statusProjectListLoaded: 'projectListLoaded',
		statusProjectInfoBeingLoaded: 'projectInfoBeingLoaded',
		statusProjectInfoLoadFailed: 'projectInfoLoadFailed',
		statusProjectInfoLoaded: 'projectInfoLoaded',
    statusDataBeingLoaded: 'dataBeingLoaded',
    statusDataLoadFailed: 'dataLoadFailed',
    statusDataLoaded: 'dataLoaded',
    statusDataChanged: 'dataChanged',
    statusDataBeingSaved: 'dataBeingSaved',
    statusDataSaveFailed: 'dataSaveFailed',
    statusDataBeingUnloaded: 'dataBeingUnloaded',
		statusScrollingData: 'scrollingData',
    statusExitingWithoutSave: 'exitingWithoutSave',

		promptTapToRequestProjectInfo: 'tapToRequestProjectInfo',

		messages: {
			en: {
				loginRequired: 'Please log in',
				loggingIn: 'Please wait while logging in...',
				loginFailed: 'Invalid  login or password',
				loginRequestFailed: 'Failed to connect',
				loggingOut: 'Please wait while loggin out...',
				projectListBeingLoaded: 'Loading projects available',
				projectListRequestFailed: 'Failed to load projects',
				projectListLoaded: 'Select a project to edit',
				projectInfoBeingLoaded: 'Loading project info...',
				projectInfoLoadFailed: 'Failed to load project info',
				projectInfoLoaded: 'Project info loaded',
				dataBeingLoaded: 'Please wait while loading project',
				dataLoadFailed: 'Failed to load project',
				dataLoaded: 'Now you may edit the data',
				dataChanged: 'Do not forget to save your data',
				dataBeingSaved: 'Please wait while saving your data',
				dataSaveFailed: 'Failed to save your data',
				dataBeingUnloaded: 'Please wait...',
				scrollingData: 'Scrolling...',
				exitingWithoutSave: 'Your data are not saved and wil be lost. Continue?',
				emptyTable: 'No input data for the chosen date interval!',
				tapToRequestProjectInfo: 'Tap ' + String.fromCharCode(0x24D8) + ' to request project info'
			},
			ru: {
				loginRequired: 'Введите логин и пароль',
				loggingIn: 'Авторизация...',
				loginFailed: 'Неверный логи или пароль',
				loginRequestFailed: 'Ошибка соединения',
				loggingOut: 'Выход...',
				projectListBeingLoaded: 'Загружается список проектов',
				projectListRequestFailed: 'Ошибка при загрузке списка проектов',
				projectListLoaded: 'Выберите проект',
				projectInfoBeingLoaded: 'Загружается информация по проекту...',
				projectInfoLoadFailed: 'Не удалось загрузить информацию по проекту',
				projectInfoLoaded: 'Информация по проекту загружена',
				dataBeingLoaded: 'Данные загружаются...',
				dataLoadFailed: 'Ошибка при загрузке данных',
				dataLoaded: 'Можно редактировать данные',
				dataChanged: 'Не забудьте сохранить данные',
				dataBeingSaved: 'Данные сохраняются...',
				dataSaveFailed: 'Не удалось сохранить данные',
				dataBeingUnloaded: 'Возврат к списку проектов...',
				scrollingData: 'Данные подгружаются...',
				exitingWithoutSave: 'Данные не сохранены и будут потеряны. Ок?',
				emptyTable: 'Для выбранного интервала дат данные по учету вводить не требуется!',								
				tapToRequestProjectInfo: 'Нажмите ' + String.fromCharCode(0x24D8) + ' чтобы запросить информацию по проекту'
			}
		}
};
