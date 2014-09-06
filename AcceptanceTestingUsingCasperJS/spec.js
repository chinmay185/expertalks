var APP_URL = "http://todomvc.com/architecture-examples/angularjs/#/";
casper.options.viewportSize = {
    width: 1024,
    height: 768
};

var captureScreenshot = function() {
    casper.then(function() {
        casper.capture("image.png")
    });
};
casper.options.logLevel = "info";
casper.options.verbose = true;

casper.test.setUp(function() {
    casper.start(APP_URL);
});

casper.test.begin('Test Todo App', function() {
    // todo heading is correct
    casper.start(APP_URL, function() {
        var xpath = "//h1[text()='todos']";
        casper.test.assertVisible({
            type: 'xpath',
            path: xpath
        }, "todo heading is correct");
    });

    // the placeholder on add todo text box is correct
    casper.then(function() {
        casper.test.assertEquals(this.getElementAttribute('#new-todo', 'placeholder'), 'What needs to be done?', "the placeholder on add todo text box is correct");
    });

    // todo list should be initially empty
    function getTodos() {
        var todos = document.querySelectorAll('#todo-list li');
        return todos;
    }

    function getCompletedTodos() {
        var todos = document.querySelectorAll('.completed');
        return todos;
    }
    casper.then(function() {
        var allTodos = casper.evaluate(getTodos);
        casper.test.assert((allTodos.length === 0), 'todo list should be initially empty');
    });

    // verify a todo can be added
    casper.then(function() {
        this.sendKeys('#new-todo', 'casperjs');
        this.sendKeys('#new-todo', casper.page.event.key.Enter);
    });
    casper.then(function() {
        var allTodos = this.evaluate(getTodos);
        casper.test.assert((allTodos.length === 1), 'list should have 1 todo');
        casper.test.assertEquals("1", this.getHTML("#todo-count strong"), 'list should have 1 todo now');
        casper.test.assertEquals("item left", this.getHTML("#todo-count ng-pluralize"), 'list should have 1 todo now');
    });

    // add another todo
    casper.then(function() {
        this.sendKeys('#new-todo', 'phantomjs');
        this.sendKeys('#new-todo', casper.page.event.key.Enter);
    });
    casper.then(function() {
        var allTodos = this.evaluate(getTodos);
        casper.test.assert((allTodos.length === 2), 'list should have 2 todos now');
        casper.test.assertEquals("2", this.getHTML("#todo-count strong"), 'list should have 2 todos now');
        casper.test.assertEquals("items left", this.getHTML("#todo-count ng-pluralize"), 'list should have 2 todos now');
    });

    // check all todos
    casper.then(function() {
        this.click("#toggle-all");
    });
    casper.then(function() {
        var completedTodos = this.evaluate(getCompletedTodos);
        casper.test.assert((completedTodos.length === 2), 'list should have 2 todos now');
    });

    // clear completed todos
    casper.then(function() {
        this.click("#clear-completed");
    });
    casper.then(function() {
        var allTodos = casper.evaluate(getTodos);
        casper.test.assert((allTodos.length === 0), 'todo list should be empty after clearing todos');
    });
    casper.then(function() {
        captureScreenshot();
    });
    casper.run(function() {
        casper.test.done();
        this.exit();
    });
});