(function ($) {

    $.widget(
        'terminal.cursor',
        {
            options: {
                html: '&nbsp;',
                period: 400,
                delay: 1200
            },

            _create: function () {
                this._originalContents = this.element.html();
                this.element.html(this.option('html'));
            },

            _init: function () {
                this.element.addClass('terminal-cursor');
                this._blinking = false;
                this.element.stop(true, true);
                this.element.removeAttr('style');
            },

            destroy: function () {
                this.element.removeClass('terminal-cursor');
                this.element.html(this._originalContents);
                $.Widget.prototype.destroy.call(this);
            },

            blink: function () {
                if (! this._blinking) {
                    this._blinking = true;
                    this.element.delay(this.option('delay'));
                    this._blink();
                }
            },

            _blink: function () {
                if (this._blinking) {
                    this.element.animate(
                        {
                            backgroundColor: this.element.css('color'),
                            color: this.element.css('background-color')
                        },
                        this.option('period'),
                        $.proxy(this._blink, this)
                    );
                }
            },

            stopBlinking: function () {
                this._init();
            }
        }
    );

    $.widget(
        'terminal.console',
        {
            options: {
                callback: function () { },
                delay: 800
            },

            _create: function () {
                var cursorElement = $('<span/>');
                this.element.addClass('terminal-console');
                this._cursor = new $.terminal.cursor({}, cursorElement);
                this._buffer = [];

                $(document).on(
                    'keypress.console',
                    null,
                    { console: this },
                    $.proxy(this._keypress, this)
                );
                $(document).on(
                    'keydown.console',
                    null,
                    { console: this },
                    $.proxy(this._keydown, this)
                );

                this.showCursor();
                this._cursor.blink();
            },

            cursor: function (method) {
                var args = Array.prototype.slice.call(arguments, 1);

                if ($.isFunction(this._cursor[method])) {
                    this._cursor[method].apply(this._cursor, args);
                }
            },

            destroy: function () {
                this.element.removeClass('terminal-console');
                this._cursor.element.remove();
                $.Widget.prototype.destroy.call(this);
            },

            hideCursor: function () {
                this._cursor.element.detach();
            },

            print: function (text) {
                for (var i = 0; i < text.length; i++) {
                    var delay = 75 + Math.random() * 100;
                    var effect = ($.proxy(function (text) {
                        return $.proxy(function () {
                            this._stopBlinking();
                            this.hideCursor();
                            this._write(
                                text,
                                { css: { display: 'none' }}
                            ).fadeIn();
                            this.showCursor();
                            this.element.dequeue();
                        }, this);
                    }, this))(text[i]);

                    this.element.delay(delay).queue(effect);
                }
                this._resumeBlinking();
            },

            read: function () {
                var input = this._buffer.join('');
                this._buffer = [];
                return input;
            },

            showCursor: function () {
                this.element.append(this._cursor.element);
            },

            write: function (text) {
                this._stopBlinking();
                this.hideCursor();

                for (var i = 0; i < text.length; i++) {
                    this._write(text[i]);
                }

                this.showCursor();
                this._resumeBlinking();
            },

            _callback: function (data) {
                
                this.option('callback').call(this, data);
            },

            _delete: function () {
                var lastElement = this.element.children().slice(-2, -1);
                this._stopBlinking();
                this.hideCursor();

                if (
                        this._buffer.length > 0
                        &&
                        lastElement.is('span')
                   )
                {
                    this._buffer.pop();
                    lastElement.remove();
                }

                this.showCursor();
                this._resumeBlinking();
            },

            _keydown: function (event) {
                var console = event.data.console;
                var keycode = event.which;

                if (keycode == /* backspace */ 8) {
                    this._delete();
                }
            },

            _keypress: function (event) {
                var console = event.data.console;
                var character = String.fromCharCode(event.which);

                this._buffer.push(character);
                this.write(character);

                if (character == /* enter key */ '\r') {
                    var input = this.read();

                    this._callback(input);
                }
            },

            _prompt: function () {
                this.write('> ');
            },

            _resumeBlinking: function () {
                if (! this._timeout) {
                    this._timeout = setTimeout(
                            $.proxy(function () {
                                var time = (new Date()).getTime();
                                this._timeout = false;

                                if (
                                    (time - this._lastStopped)
                                    >
                                    this.option('delay')
                                   )
                                {
                                    this._cursor.blink();
                                }
                                else {
                                    this._resumeBlinking();
                                }
                            }, this),
                            this.option('delay') / 2
                        );
                }
            },

            _stopBlinking: function () {
                this._lastStopped = (new Date()).getTime();
                this._cursor.stopBlinking();
            },

            _write: function (text, options) {
                var options = $.extend({ text: text }, options);
                var container;

                if (text.match(/^\r|\n$/)) {
                    container = $('<br/>');
                }
                else {
                    container = $('<span/>', options);
                }

                this.element.append(container);

                return container;
            }
        }
    );

    $.widget(
        'terminal.terminal',
        $.terminal.console,
        {
            _create: function () {
                $.terminal.console.prototype._create.call(this, arguments);
                this._prompt();
            },

            /*
            _setOption: function () {
            },

            destroy: function () {
            },
            */

            _callback: function (data) {
               var args = data.match(/(\'.*\')|(\".*\")|(\w+)/g);
               this.option('callback').apply(this, args);
               this._prompt();
            },

            _prompt: function () {
                this.write('> ');
            }
        }
    );

})(jQuery);