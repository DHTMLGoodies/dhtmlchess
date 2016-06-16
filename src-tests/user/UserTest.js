TestCase("UserTest", {

	setupComplete:false,
	"setUpPage":function () {


	},
	"setUp":function () {
		if (!this.setUpComplete) {
			window.chess.URL = '../../chess-controller.php';
			document.body.innerHTML = '';
			new chess.view.user.LoginButton({ els:{ parentEl:document.body } });
			new chess.view.user.RegisterButton({ els:{ parentEl:document.body } });
			new chess.view.user.LogoutButton({ els:{ parentEl:document.body } });
			new chess.view.user.Panel({ els:{ parentEl:document.body } });
			new chess.view.user.SettingsButton({ els:{ parentEl:document.body } });
			new chess.view.menuItems.GameImport({ els:{ parentEl:document.body } });
			new chess.view.menuItems.SaveGame({ els:{ parentEl:document.body } });

			window.controller = new chess.view.user.Controller();

			this.setUpComplete = true;
		}

	},

	getController:function () {
		return window.controller;
	},

	"test should be able to register login button":function () {

		var controller = this.getController();

		assertNotUndefined(controller.components.registerWindow);
		assertNotUndefined(controller.components.loginWindow);
		assertNotUndefined(controller.components.loginButton);
		assertNotUndefined(controller.components.logoutButton);
		assertNotUndefined(controller.components.registerButton);
		assertNotUndefined(controller.components.menuItemGameImport);
		assertNotUndefined(controller.components.menuItemSaveGame);
	},


	"test should show login button on missing session token":function () {
		// given
		var controller = this.getController();

		// when
		controller.fireEvent('invalidSession');

		// then
		assertFalse(controller.components.loginButton.isHidden());
		assertFalse(controller.components.registerButton.isHidden());
		assertTrue(controller.components.logoutButton.isHidden());
	},

	"test should show logout button on valid session token":function () {
		// given
		var controller = this.getController();

		// when
		controller.fireEvent('invalidSession');
		controller.fireEvent('validSession');

		// then
		assertTrue(controller.components.loginButton.isHidden());
		assertTrue(controller.components.registerButton.isHidden());
		assertFalse(controller.components.logoutButton.isHidden());
	},

	"test should show login window when click on login button":function () {
		// given
		var controller = this.getController();
		var button = controller.components.loginButton;
		// when
		button.click();

		// then
		assertFalse(controller.components.loginWindow.isHidden());

	},

	"test should show register window when click on register button":function () {
		// given
		var controller = this.getController();
		var button = controller.components.registerButton;
		// when
		button.click();

		// then
		assertFalse(controller.components.registerWindow.isHidden());
	},

	"test should show user panel on successful login":function () {
		// given
		var controller = this.getController();
		var loginWindow = controller.components.loginWindow;

		// when
		loginWindow.fireEvent('loginSuccess', { token:'dummy'});

		// then
		assertFalse(controller.components.userPanel.isHidden());
	},

	"test should show and hide components on logout":function () {
		// given
		var controller = this.getController();
		controller.components.loginWindow.fireEvent('loginSuccess', { token:'dummy'});

		// when
		controller.components.logoutButton.click();

		// then
		assertTrue(controller.components.userPanel.isHidden());
		assertTrue(controller.components.logoutButton.isHidden());
		assertFalse(controller.components.loginButton.isHidden());
		assertFalse(controller.components.registerButton.isHidden());

	},

	"test should show and hide components on registration":function () {
		// given
		var controller = this.getController();
		var registerWindow = controller.components.registerWindow;

		// when
		registerWindow.fireEvent('registerSuccess', { token:'dummy'});

		// then
		assertFalse(controller.components.userPanel.isHidden());

	},

	"test should show profile window on click on gears button":function () {
		// given
		var controller = this.getController();
		var button = controller.components.settingsButton;
		var profileWin = controller.components.profileWindow;

		// when
		button.click();

		// then
		assertFalse(profileWin.isHidden());
	},

	"test game import menu item should be initial disabled":function () {
		// given
		var controller = this.getController();
		// when
		var menuItem = controller.components.menuItemGameImport;
		// then
		assertTrue(menuItem.isDisabled());

	},

	"test should enable import game button on sufficient access":function () {
		// given
		var controller = this.getController();
		var menuItem = controller.components.menuItemGameImport;
		// when
		controller.fireEvent('userAccess', window.chess.UserRoles.GAME_IMPORT + window.chess.UserRoles.EDIT_FOLDERS);

		// then
		assertFalse(menuItem.isDisabled());
	},

	"test should enable import game button on login":function () {
		// given
		var controller = this.getController();
		var menuItem = controller.components.menuItemGameImport;
		menuItem.disable();

		// when
		controller.login({
			user_access:4095
		});
		// then
		assertFalse(menuItem.isDisabled());
	},

	"test should disable import game button on logout":function () {
		// given
		var controller = this.getController();
		var menuItem = controller.components.menuItemGameImport;
		menuItem.disable();
		controller.login({
			user_access:4095
		});

		// when
		controller.logout();

		// then
		assertTrue(menuItem.isDisabled());
	}
});