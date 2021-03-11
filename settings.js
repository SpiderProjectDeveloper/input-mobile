import React, { Component } from 'react';
import { AntDesign } from '@expo/vector-icons'; 
import { Dimensions } from 'react-native';

export const settings = {
		window: Dimensions.get('window'),
		editTableInitialLoad: 24,

		fakeConnection: false,

		lang: 'ru',

		texts: {
			en: {
				server: "Server",
				port: "Port",
				user: "User",
				password: "Password"
			},
			ru:  {
				server: "Сервер",
				port: "Порт",
				user: "Пользователь",
				password: "Пароль"
			},
		},

    loginButton: <AntDesign name="user" size={20} color="white"/>,
    logoutButton: <AntDesign name="logout" size={20} color="white"/>,
    yesButton: <AntDesign name="check" size={20} color="white"/>,
    noButton: <AntDesign name="close" size={20} color="white"/>,
    backToProjectsButton: <AntDesign name="left" size={20} color="white"/>,
    saveButton: <AntDesign name="upload" size={20} color="white"/>,

		loadingIcon: <AntDesign name="loading1" size={28} color="black" />,
		fileIcon: <AntDesign name="file1" size={18} color="#004444" />,

    nextPageDownButton: <AntDesign name="caretdown" size={20} color="lightgray"/>,
		nextPageUpButton: <AntDesign name="caretup" size={20} color="lightgray"/>,

		defaultCellWidth: 140,
		tableCellFontSize:14,

    screenBgColor: '#ffffff',
    screenBgColor2: '#f0f0f0',
    activeButtonBgColor: '#449999',
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
    statusDataBeingLoaded: 'dataBeingLoaded',
    statusDataLoadFailed: 'dataLoadFailed',
    statusDataLoaded: 'dataLoaded',
    statusDataChanged: 'dataChanged',
    statusDataBeingSaved: 'dataBeingSaved',
    statusDataSaveFailed: 'dataSaveFailed',
    statusDataBeingUnloaded: 'dataBeingUnloaded',
    statusExitingWithoutSave: 'exitingWithoutSave',

		messages: {
			en: {
				loginRequired: 'Please log in',
				loggingIn: 'Please wait while loggin in...',
				loginFailed: 'Invalid  login or password',
				loginRequestFailed: 'Failed to connect',
				loggingOut: 'Please wait while loggin out...',
				projectListBeingLoaded: 'Loading projects available',
				projectListRequestFailed: 'Failed to load projects',
				projectListLoaded: 'Select a project to edit',
				dataBeingLoaded: 'Please wait while loading project',
				dataLoadFailed: 'Failed to load project',
				dataLoaded: 'Now you may edit the data',
				dataChanged: 'Do not forget to save your data',
				dataBeingSaved: 'Please wait while saving your data',
				dataSaveFailed: 'Failed to save your data',
				dataBeingUnloaded: 'Please wait...',
				exitingWithoutSave: 'Your data are not saved and wil be lost. Continue?'				
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
				dataBeingLoaded: 'Данные загружаются...',
				dataLoadFailed: 'Ошибка при загрузке данных',
				dataLoaded: 'Можно редактировать данные',
				dataChanged: 'Не забудьте сохранить данные',
				dataBeingSaved: 'Данные сохраняются...',
				dataSaveFailed: 'Не удалось сохранить данные',
				dataBeingUnloaded: 'Возврат к списку проектов...',
				exitingWithoutSave: 'Данные не сохранены и будут потеряны. Ок?'				
			}
		}
};
